import type { BmiClassification } from '@/domain/calculations/bmi'
import type { ActivityLevel } from '@/domain/value-objects/activity-level'
import type { Goal } from '@/domain/value-objects/goal'
import type { GoalStatus } from '@/domain/value-objects/goal-status'
import type { MacroStrategy } from '@/domain/value-objects/macro-strategy'
import type { Sex } from '@/domain/value-objects/sex'
import {
  ActivityLevel as DbActivityLevel,
  BmrSex as DbBmrSex,
  type Goal as DbGoalRow,
  GoalStatus as DbGoalStatus,
  GoalType as DbGoalType,
  MacroStrategy as DbMacroStrategy,
  type Prisma,
} from '@/generated/prisma/client'
import type {
  NewSnapshotInput,
  StudentGoalRecord,
  StudentHealthProfileRecord,
  StudentHealthRepository,
  StudentMeasurementRecord,
  StudentSnapshotRecord,
} from '@/infrastructure/repositories/student-health-repository'
import { prisma } from '../client'

/** The DB enums are SCREAMING_CASE; every domain value object stays lowercase — see `PrismaProfileRepository` for the same convention. */
const toDomainGoalType = (type: DbGoalType): Goal => type.toLowerCase() as Goal
const toDbGoalType = (type: Goal): DbGoalType => type.toUpperCase() as DbGoalType
const toDbSex = (sex: Sex): DbBmrSex => sex.toUpperCase() as DbBmrSex
const toDbActivityLevel = (level: ActivityLevel): DbActivityLevel =>
  level.toUpperCase() as DbActivityLevel
const toDbMacroStrategy = (strategy: MacroStrategy): DbMacroStrategy =>
  strategy.toUpperCase() as DbMacroStrategy

function toGoalRecord(row: DbGoalRow): StudentGoalRecord {
  return {
    id: row.id,
    type: toDomainGoalType(row.type),
    initialWeightKg: row.initialWeightKg?.toNumber(),
    targetWeightKg: row.targetWeightKg?.toNumber(),
    targetDate: row.targetDate ?? undefined,
    calorieAdjustmentPercent: row.calorieAdjustmentPercent.toNumber(),
    status: row.status.toLowerCase() as GoalStatus,
    startedAt: row.startedAt,
    endedAt: row.endedAt ?? undefined,
  }
}

export class PrismaStudentHealthRepository implements StudentHealthRepository {
  async ensureStudentProfile(studentId: string): Promise<void> {
    await prisma.studentProfile.upsert({
      where: { userId: studentId },
      create: { userId: studentId },
      update: {},
    })
  }

  async getBirthDate(studentId: string): Promise<Date | null> {
    const row = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      select: { birthDate: true },
    })
    return row?.birthDate ?? null
  }

  async getHealthProfile(studentId: string): Promise<StudentHealthProfileRecord | null> {
    const row = await prisma.healthProfile.findUnique({ where: { studentId } })
    if (!row) return null

    return {
      heightCm: row.heightCm.toNumber(),
      sex: row.bmrSex.toLowerCase() as Sex,
      activityLevel: row.activityLevel.toLowerCase() as ActivityLevel,
      macroStrategy: row.macroStrategy.toLowerCase() as MacroStrategy,
      customProteinPercentage: row.customProteinPercentage?.toNumber(),
      customCarbsPercentage: row.customCarbsPercentage?.toNumber(),
      customFatPercentage: row.customFatPercentage?.toNumber(),
    }
  }

  async saveHealthProfile(
    studentId: string,
    input: { birthDate: Date } & StudentHealthProfileRecord
  ): Promise<void> {
    await prisma.$transaction([
      prisma.studentProfile.upsert({
        where: { userId: studentId },
        create: { userId: studentId, birthDate: input.birthDate },
        update: { birthDate: input.birthDate },
      }),
      prisma.healthProfile.upsert({
        where: { studentId },
        create: {
          studentId,
          heightCm: input.heightCm,
          bmrSex: toDbSex(input.sex),
          activityLevel: toDbActivityLevel(input.activityLevel),
          macroStrategy: toDbMacroStrategy(input.macroStrategy),
          customProteinPercentage: input.customProteinPercentage,
          customCarbsPercentage: input.customCarbsPercentage,
          customFatPercentage: input.customFatPercentage,
          updatedBy: studentId,
        },
        update: {
          heightCm: input.heightCm,
          bmrSex: toDbSex(input.sex),
          activityLevel: toDbActivityLevel(input.activityLevel),
          macroStrategy: toDbMacroStrategy(input.macroStrategy),
          customProteinPercentage: input.customProteinPercentage,
          customCarbsPercentage: input.customCarbsPercentage,
          customFatPercentage: input.customFatPercentage,
          updatedBy: studentId,
        },
      }),
    ])
  }

  async listMeasurements(studentId: string, limit = 20): Promise<StudentMeasurementRecord[]> {
    const rows = await prisma.bodyMeasurement.findMany({
      where: { studentId },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    })

    return rows.map((row) => ({
      id: row.id,
      weightKg: row.weightKg.toNumber(),
      bodyFatPercentage: row.bodyFatPercentage?.toNumber(),
      waistCm: row.waistCm?.toNumber(),
      recordedAt: row.recordedAt,
    }))
  }

  async addMeasurement(
    studentId: string,
    input: { weightKg: number; bodyFatPercentage?: number; waistCm?: number; recordedBy: string }
  ): Promise<StudentMeasurementRecord> {
    const row = await prisma.bodyMeasurement.create({
      data: {
        studentId,
        weightKg: input.weightKg,
        bodyFatPercentage: input.bodyFatPercentage,
        waistCm: input.waistCm,
        recordedAt: new Date(),
        recordedBy: input.recordedBy,
      },
    })

    return {
      id: row.id,
      weightKg: row.weightKg.toNumber(),
      bodyFatPercentage: row.bodyFatPercentage?.toNumber(),
      waistCm: row.waistCm?.toNumber(),
      recordedAt: row.recordedAt,
    }
  }

  async getActiveGoal(studentId: string): Promise<StudentGoalRecord | null> {
    const row = await prisma.goal.findFirst({
      where: { studentId, status: DbGoalStatus.ACTIVE },
      orderBy: { startedAt: 'desc' },
    })
    return row ? toGoalRecord(row) : null
  }

  async listGoals(studentId: string): Promise<StudentGoalRecord[]> {
    const rows = await prisma.goal.findMany({
      where: { studentId },
      orderBy: { startedAt: 'desc' },
    })
    return rows.map(toGoalRecord)
  }

  async setGoal(
    studentId: string,
    input: {
      type: Goal
      targetWeightKg?: number
      targetDate?: Date
      calorieAdjustmentPercent: number
      createdBy: string
    }
  ): Promise<StudentGoalRecord> {
    // Not part of the transaction below — a tiny race with a
    // simultaneous new measurement is an acceptable trade-off for
    // avoiding an interactive transaction here.
    const latestMeasurement = await prisma.bodyMeasurement.findFirst({
      where: { studentId },
      orderBy: { recordedAt: 'desc' },
      select: { weightKg: true },
    })

    const [, created] = await prisma.$transaction([
      // Ending the previous goal is a status change, not a delete — its
      // history stays queryable (doc principle: never overwrite, never delete).
      prisma.goal.updateMany({
        where: { studentId, status: DbGoalStatus.ACTIVE },
        data: { status: DbGoalStatus.CANCELLED, endedAt: new Date() },
      }),
      prisma.goal.create({
        data: {
          studentId,
          type: toDbGoalType(input.type),
          initialWeightKg: latestMeasurement?.weightKg,
          targetWeightKg: input.targetWeightKg,
          targetDate: input.targetDate,
          calorieAdjustmentPercent: input.calorieAdjustmentPercent,
          status: DbGoalStatus.ACTIVE,
          createdBy: input.createdBy,
        },
      }),
    ])

    return toGoalRecord(created)
  }

  async getLatestSnapshot(studentId: string): Promise<StudentSnapshotRecord | null> {
    const row = await prisma.healthSnapshot.findFirst({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    })
    if (!row) return null

    return {
      id: row.id,
      bmi: row.bmi.toNumber(),
      bmiClassification: row.bmiClassification as BmiClassification,
      bmrKcal: row.bmrKcal,
      tdeeKcal: row.tdeeKcal,
      calorieTargetKcal: row.calorieTargetKcal,
      proteinG: row.proteinG.toNumber(),
      carbsG: row.carbsG.toNumber(),
      fatG: row.fatG.toNumber(),
      createdAt: row.createdAt,
    }
  }

  async addSnapshot(studentId: string, input: NewSnapshotInput): Promise<StudentSnapshotRecord> {
    const row = await prisma.healthSnapshot.create({
      data: {
        studentId,
        measurementId: input.measurementId,
        goalId: input.goalId,
        bmi: input.bmi,
        bmiClassification: input.bmiClassification,
        bmrKcal: input.bmrKcal,
        tdeeKcal: input.tdeeKcal,
        calorieTargetKcal: input.calorieTargetKcal,
        proteinG: input.proteinG,
        carbsG: input.carbsG,
        fatG: input.fatG,
        bmiFormulaVersion: input.bmiFormulaVersion,
        bmrFormulaVersion: input.bmrFormulaVersion,
        tdeeFormulaVersion: input.tdeeFormulaVersion,
        macroFormulaVersion: input.macroFormulaVersion,
        inputSnapshot: input.inputSnapshot as Prisma.InputJsonValue,
        createdBy: input.createdBy,
      },
    })

    return {
      id: row.id,
      bmi: row.bmi.toNumber(),
      bmiClassification: row.bmiClassification as BmiClassification,
      bmrKcal: row.bmrKcal,
      tdeeKcal: row.tdeeKcal,
      calorieTargetKcal: row.calorieTargetKcal,
      proteinG: row.proteinG.toNumber(),
      carbsG: row.carbsG.toNumber(),
      fatG: row.fatG.toNumber(),
      createdAt: row.createdAt,
    }
  }
}
