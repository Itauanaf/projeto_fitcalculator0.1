import type { AttentionFlagKind, StudentStatus } from '@/domain/calculations/attention-flags'
import type { BmiClassification } from '@/domain/calculations/bmi'
import type { ActivityLevel } from '@/domain/value-objects/activity-level'
import type { CheckInFrequency } from '@/domain/value-objects/check-in-frequency'
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

export const CHECK_IN_FREQUENCY_LABELS: Record<CheckInFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'A cada 15 dias',
  monthly: 'Mensal',
  manual: 'Manual',
}

/** Deliberately operational wording, not medical — see `AttentionFlagKind`'s doc comment. */
export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  active: 'Ativo',
  no_updates: 'Sem atualização',
  goal_reached: 'Meta atingida',
}

export const STUDENT_STATUS_TONE: Record<StudentStatus, BadgeTone> = {
  active: 'success',
  no_updates: 'warning',
  goal_reached: 'success',
}

/** One-line description for each attention-flag kind — "Precisam de atenção" and the activity feed read from this. */
export const ATTENTION_FLAG_LABELS: Record<
  AttentionFlagKind,
  (flag: { days?: number; weightChangeKg?: number; percent?: number }) => string
> = {
  no_check_in: (flag) => `Sem check-in há ${flag.days} ${flag.days === 1 ? 'dia' : 'dias'}`,
  no_weight_update: (flag) =>
    `Sem atualizar peso há ${flag.days} ${flag.days === 1 ? 'dia' : 'dias'}`,
  weight_change: (flag) => {
    const kg = flag.weightChangeKg ?? 0
    const formatted = `${kg > 0 ? '+' : ''}${kg.toFixed(1).replace('.', ',')}kg`
    return `Peso alterou ${formatted} em ${flag.days} dias`
  },
  incomplete_profile: () => 'Perfil incompleto',
  goal_reached: () => 'Meta atingida',
  near_goal: (flag) => `Próximo da meta (${flag.percent}% concluído)`,
  low_adherence: (flag) => `Baixa aderência recorrente (média de ${flag.percent}%)`,
}
