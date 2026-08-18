import type { BmiClassification } from '@/domain/calculations/bmi'
import {
  InvitationStatus as DbInvitationStatus,
  RelationshipStatus as DbRelationshipStatus,
} from '@/generated/prisma/client'
import type {
  InvitationLookup,
  LinkedStudentRecord,
  StudentInvitationRecord,
  TrainerProfileRecord,
  TrainerRepository,
} from '@/infrastructure/repositories/trainer-repository'
import { prisma } from '../client'

const toDomainInvitationStatus = (status: DbInvitationStatus) =>
  status.toLowerCase() as StudentInvitationRecord['status']

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
          startedAt: new Date(),
        },
        update: {
          status: DbRelationshipStatus.ACTIVE,
          startedAt: new Date(),
          endedAt: null,
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
            healthSnapshots: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    })

    return rows.map((row) => {
      const snapshot = row.student.healthSnapshots[0]

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
      }
    })
  }
}
