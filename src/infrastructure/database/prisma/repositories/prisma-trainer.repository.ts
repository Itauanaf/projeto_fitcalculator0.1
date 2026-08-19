import type { BmiClassification } from '@/domain/calculations/bmi'
import { calculateNextCheckInDate } from '@/domain/calculations/check-in-schedule'
import type { CheckInFrequency } from '@/domain/value-objects/check-in-frequency'
import type { Goal } from '@/domain/value-objects/goal'
import {
  CheckInFrequency as DbCheckInFrequency,
  GoalStatus as DbGoalStatus,
  type GoalType as DbGoalType,
  InvitationStatus as DbInvitationStatus,
  RelationshipStatus as DbRelationshipStatus,
} from '@/generated/prisma/client'
import type {
  CheckInSchedule,
  InvitationLookup,
  LinkedStudentRecord,
  StudentInvitationRecord,
  TrainerProfileRecord,
  TrainerRepository,
} from '@/infrastructure/repositories/trainer-repository'
import { prisma } from '../client'

const toDomainInvitationStatus = (status: DbInvitationStatus) =>
  status.toLowerCase() as StudentInvitationRecord['status']
const toDomainCheckInFrequency = (frequency: DbCheckInFrequency): CheckInFrequency =>
  frequency.toLowerCase() as CheckInFrequency
const toDbCheckInFrequency = (frequency: CheckInFrequency): DbCheckInFrequency =>
  frequency.toUpperCase() as DbCheckInFrequency
const toDomainGoalType = (type: DbGoalType): Goal => type.toLowerCase() as Goal

export class PrismaTrainerRepository implements TrainerRepository {
  async ensureTrainerProfile(trainerId: string): Promise<void> {
    await prisma.trainerProfile.upsert({
      where: { userId: trainerId },
      create: { userId: trainerId },
      update: {},
    })
  }

  async getTrainerProfile(trainerId: string): Promise<TrainerProfileRecord | null> {
    const row = await prisma.trainerProfile.findUnique({ where: { userId: trainerId } })
    if (!row) return null

    return {
      phone: row.phone ?? undefined,
      cref: row.cref ?? undefined,
      bio: row.bio ?? undefined,
    }
  }

  async saveTrainerProfile(trainerId: string, input: TrainerProfileRecord): Promise<void> {
    // `undefined` in a Prisma `update` means "leave this field alone", not
    // "clear it" — an explicit `null` is required so blanking a
    // previously-filled phone/cref/bio actually clears it in the DB.
    const data = {
      phone: input.phone ?? null,
      cref: input.cref ?? null,
      bio: input.bio ?? null,
    }

    await prisma.trainerProfile.upsert({
      where: { userId: trainerId },
      create: { userId: trainerId, ...data },
      update: data,
    })
  }

  async createInvitation(
    trainerId: string,
    input: { email: string; tokenHash: string; expiresAt: Date }
  ): Promise<StudentInvitationRecord> {
    const row = await prisma.studentInvitation.create({
      data: {
        trainerId,
        email: input.email,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        status: DbInvitationStatus.PENDING,
      },
    })

    return {
      id: row.id,
      email: row.email,
      status: toDomainInvitationStatus(row.status),
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    }
  }

  async listInvitations(trainerId: string): Promise<StudentInvitationRecord[]> {
    const rows = await prisma.studentInvitation.findMany({
      where: { trainerId },
      orderBy: { createdAt: 'desc' },
    })

    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      status: toDomainInvitationStatus(row.status),
      expiresAt: row.expiresAt,
      createdAt: row.createdAt,
    }))
  }

  async findInvitationByTokenHash(tokenHash: string): Promise<InvitationLookup | null> {
    const row = await prisma.studentInvitation.findFirst({
      where: { tokenHash },
      include: { trainer: { include: { profile: true } } },
    })
    if (!row) return null

    return {
      id: row.id,
      trainerId: row.trainerId,
      trainerName: row.trainer.profile.fullName,
      email: row.email,
      status: toDomainInvitationStatus(row.status),
      expiresAt: row.expiresAt,
    }
  }

  async acceptInvitation(
    invitationId: string,
    trainerId: string,
    studentId: string
  ): Promise<void> {
    const startedAt = new Date()
    // Matches `checkInFrequency`'s own schema default (`WEEKLY`) — without
    // this, a fresh link would sit at `nextCheckInAt: null` ("not_scheduled")
    // until the trainer explicitly saved a frequency once.
    const nextCheckInAt = calculateNextCheckInDate('weekly', startedAt)

    await prisma.$transaction([
      prisma.studentInvitation.update({
        where: { id: invitationId },
        data: {
          status: DbInvitationStatus.ACCEPTED,
          acceptedByStudentId: studentId,
          acceptedAt: new Date(),
        },
      }),
      prisma.trainerStudent.upsert({
        where: { trainerId_studentId: { trainerId, studentId } },
        create: {
          trainerId,
          studentId,
          status: DbRelationshipStatus.ACTIVE,
          startedAt,
          nextCheckInAt,
        },
        update: {
          status: DbRelationshipStatus.ACTIVE,
          startedAt,
          endedAt: null,
          nextCheckInAt,
        },
      }),
    ])
  }

  async listActiveStudents(trainerId: string): Promise<LinkedStudentRecord[]> {
    const rows = await prisma.trainerStudent.findMany({
      where: { trainerId, status: DbRelationshipStatus.ACTIVE },
      orderBy: { startedAt: 'desc' },
      include: {
        student: {
          include: {
            profile: true,
            healthProfile: { select: { studentId: true } },
            healthSnapshots: { orderBy: { createdAt: 'desc' }, take: 1 },
            // Enough recent history for the "sem atualização"/"mudança de
            // peso" attention flags and the trainer's activity feed —
            // not the student's full history (see `getStudentDetail` for that).
            measurements: { orderBy: { recordedAt: 'desc' }, take: 10 },
            checkIns: {
              orderBy: { submittedAt: 'desc' },
              take: 3,
              include: { measurement: { select: { weightKg: true } } },
            },
            goals: { orderBy: { startedAt: 'desc' }, take: 5 },
          },
        },
      },
    })

    return rows.map((row) => {
      const snapshot = row.student.healthSnapshots[0]
      const activeGoalRow = row.student.goals.find((goal) => goal.status === DbGoalStatus.ACTIVE)

      return {
        studentId: row.studentId,
        fullName: row.student.profile.fullName,
        startedAt: row.startedAt ?? row.createdAt,
        latestSnapshot: snapshot
          ? {
              id: snapshot.id,
              bmi: snapshot.bmi.toNumber(),
              bmiClassification: snapshot.bmiClassification as BmiClassification,
              bmrKcal: snapshot.bmrKcal,
              tdeeKcal: snapshot.tdeeKcal,
              calorieTargetKcal: snapshot.calorieTargetKcal,
              proteinG: snapshot.proteinG.toNumber(),
              carbsG: snapshot.carbsG.toNumber(),
              fatG: snapshot.fatG.toNumber(),
              createdAt: snapshot.createdAt,
            }
          : null,
        checkInFrequency: toDomainCheckInFrequency(row.checkInFrequency),
        lastCheckInAt: row.lastCheckInAt ?? undefined,
        nextCheckInAt: row.nextCheckInAt ?? undefined,
        hasHealthProfile: row.student.healthProfile !== null,
        recentMeasurements: row.student.measurements.map((m) => ({
          id: m.id,
          weightKg: m.weightKg.toNumber(),
          recordedAt: m.recordedAt,
        })),
        recentCheckIns: row.student.checkIns.map((c) => ({
          id: c.id,
          measurementId: c.measurementId,
          weightKg: c.measurement.weightKg.toNumber(),
          nutritionAdherencePercentage: c.nutritionAdherencePercentage,
          submittedAt: c.submittedAt,
        })),
        recentGoals: row.student.goals.map((g) => ({
          id: g.id,
          type: toDomainGoalType(g.type),
          startedAt: g.startedAt,
        })),
        activeGoal: activeGoalRow
          ? {
              initialWeightKg: activeGoalRow.initialWeightKg?.toNumber(),
              targetWeightKg: activeGoalRow.targetWeightKg?.toNumber(),
            }
          : undefined,
      }
    })
  }

  async isActivelyLinked(trainerId: string, studentId: string): Promise<boolean> {
    const row = await prisma.trainerStudent.findUnique({
      where: { trainerId_studentId: { trainerId, studentId } },
      select: { status: true },
    })
    return row?.status === DbRelationshipStatus.ACTIVE
  }

  async setCheckInFrequency(
    trainerId: string,
    studentId: string,
    frequency: CheckInFrequency
  ): Promise<void> {
    const link = await prisma.trainerStudent.findUnique({
      where: { trainerId_studentId: { trainerId, studentId } },
      select: { lastCheckInAt: true },
    })

    // Reschedule from the last check-in if there was one, otherwise from
    // today — either way `nextCheckInAt` reflects the newly chosen cadence immediately.
    const nextCheckInAt = calculateNextCheckInDate(frequency, link?.lastCheckInAt ?? new Date())

    await prisma.trainerStudent.update({
      where: { trainerId_studentId: { trainerId, studentId } },
      data: { checkInFrequency: toDbCheckInFrequency(frequency), nextCheckInAt },
    })
  }

  async recordCheckInCompleted(studentId: string, submittedAt: Date): Promise<void> {
    const links = await prisma.trainerStudent.findMany({
      where: { studentId, status: DbRelationshipStatus.ACTIVE },
      select: { trainerId: true, checkInFrequency: true },
    })

    await Promise.all(
      links.map((link) =>
        prisma.trainerStudent.update({
          where: { trainerId_studentId: { trainerId: link.trainerId, studentId } },
          data: {
            lastCheckInAt: submittedAt,
            nextCheckInAt: calculateNextCheckInDate(
              toDomainCheckInFrequency(link.checkInFrequency),
              submittedAt
            ),
          },
        })
      )
    )
  }

  async getCheckInScheduleForStudent(studentId: string): Promise<CheckInSchedule | null> {
    const link = await prisma.trainerStudent.findFirst({
      where: { studentId, status: DbRelationshipStatus.ACTIVE },
      orderBy: { startedAt: 'desc' },
      select: { checkInFrequency: true, lastCheckInAt: true, nextCheckInAt: true },
    })
    if (!link) return null

    return {
      frequency: toDomainCheckInFrequency(link.checkInFrequency),
      lastCheckInAt: link.lastCheckInAt ?? undefined,
      nextCheckInAt: link.nextCheckInAt ?? undefined,
    }
  }
}
