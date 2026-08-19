import type { BmiClassification } from '@/domain/calculations/bmi'
import type { ActivityLevel } from '@/domain/value-objects/activity-level'
import type { Goal } from '@/domain/value-objects/goal'
import type { InvitationStatus } from '@/domain/value-objects/invitation-status'
import type { MacroStrategy } from '@/domain/value-objects/macro-strategy'
import type { Sex } from '@/domain/value-objects/sex'
import type { BadgeTone } from '@/components/ui/badge'

/**
 * Portuguese display labels for the domain's enum-like value objects.
 * Kept out of `domain/` on purpose — the calculation engine has no
 * concept of language or presentation, only these UI-facing maps do.
 */

export const SEX_LABELS: Record<Sex, string> = {
  male: 'Masculino',
  female: 'Feminino',
}

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentário (pouco ou nenhum exercício)',
  light: 'Leve (exercício leve, 1–3 dias/semana)',
  moderate: 'Moderado (exercício moderado, 3–5 dias/semana)',
  active: 'Ativo (exercício intenso, 6–7 dias/semana)',
  very_active: 'Muito ativo (exercício intenso diário ou trabalho físico)',
}

export const GOAL_LABELS: Record<Goal, string> = {
  lose_weight: 'Emagrecimento',
  maintain: 'Manutenção de peso',
  gain_weight: 'Ganho de peso',
  gain_muscle: 'Ganho de massa',
}

export const MACRO_STRATEGY_LABELS: Record<MacroStrategy, string> = {
  balanced: 'Balanceada',
  high_protein: 'Alta proteína',
  low_carb: 'Low carb',
  keto: 'Cetogênica',
  custom: 'Personalizada',
}

export const BMI_CLASSIFICATION_LABELS: Record<BmiClassification, string> = {
  underweight: 'Abaixo do peso',
  normal: 'Peso normal',
  overweight: 'Sobrepeso',
  obese_class_1: 'Obesidade grau I',
  obese_class_2: 'Obesidade grau II',
  obese_class_3: 'Obesidade grau III',
}

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: 'Aguardando resposta',
  accepted: 'Aceito',
  expired: 'Expirado',
  cancelled: 'Cancelado',
}

/** Not a medical severity scale — just enough visual distinction to scan a list at a glance. */
export const BMI_CLASSIFICATION_TONE: Record<BmiClassification, BadgeTone> = {
  underweight: 'warning',
  normal: 'success',
  overweight: 'warning',
  obese_class_1: 'danger',
  obese_class_2: 'danger',
  obese_class_3: 'danger',
}

export const INVITATION_STATUS_TONE: Record<InvitationStatus, BadgeTone> = {
  pending: 'warning',
  accepted: 'success',
  expired: 'neutral',
  cancelled: 'neutral',
}
