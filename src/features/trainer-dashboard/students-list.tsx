import { ChevronRight, Users } from 'lucide-react'
import Link from 'next/link'
import { Avatar, Badge, Card, SectionHeader } from '@/components/ui'
import { BMI_CLASSIFICATION_LABELS, BMI_CLASSIFICATION_TONE } from '@/constants/labels'
import type { LinkedStudentRecord } from '@/infrastructure/repositories/trainer-repository'

function formatKcal(value: number): string {
  return `${value.toLocaleString('pt-BR')} kcal`
}

interface StudentsListProps {
  students: LinkedStudentRecord[]
}

/** Every student actively linked to this trainer, each with their latest computed snapshot (no recomputation here). */
export function StudentsList({ students }: StudentsListProps) {
  if (students.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <SectionHeader icon={Users} title="Seus alunos" />
        <p className="text-text-secondary">
          Nenhum aluno vinculado ainda. Convide um aluno acima para começar a acompanhá-lo.
        </p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <SectionHeader icon={Users} title="Seus alunos" />
      <div className="grid gap-3 sm:grid-cols-2">
        {students.map((student) => (
          <Link
            key={student.studentId}
            href={`/app/personal/alunos/${student.studentId}`}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-soft p-4 transition-colors hover:border-primary/40 hover:bg-primary-soft/40"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={student.fullName} size="sm" />
                <span className="font-semibold text-text-primary">{student.fullName}</span>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-text-secondary"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            {student.latestSnapshot ? (
              <div className="flex flex-col gap-2">
                <Badge
                  tone={BMI_CLASSIFICATION_TONE[student.latestSnapshot.bmiClassification]}
                  className="w-fit"
                >
                  IMC {student.latestSnapshot.bmi.toFixed(2).replace('.', ',')} ·{' '}
                  {BMI_CLASSIFICATION_LABELS[student.latestSnapshot.bmiClassification]}
                </Badge>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                  <span>TDEE {formatKcal(student.latestSnapshot.tdeeKcal)}</span>
                  <span>Meta {formatKcal(student.latestSnapshot.calorieTargetKcal)}</span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-text-secondary">
                Ainda sem medições registradas pelo aluno.
              </span>
            )}
          </Link>
        ))}
      </div>
    </Card>
  )
}
