import { Card } from '@/components/ui'
import { BMI_CLASSIFICATION_LABELS } from '@/constants/labels'
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
      <Card>
        <p className="text-text-secondary">
          Nenhum aluno vinculado ainda. Convide um aluno acima para começar a acompanhá-lo.
        </p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-text-primary">Seus alunos</h2>
      <ul className="flex flex-col divide-y divide-border">
        {students.map((student) => (
          <li key={student.studentId} className="flex flex-col gap-2 py-4">
            <span className="font-semibold text-text-primary">{student.fullName}</span>
            {student.latestSnapshot ? (
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
                <span>
                  IMC {student.latestSnapshot.bmi.toFixed(2).replace('.', ',')} ·{' '}
                  {BMI_CLASSIFICATION_LABELS[student.latestSnapshot.bmiClassification]}
                </span>
                <span>TDEE {formatKcal(student.latestSnapshot.tdeeKcal)}</span>
                <span>Meta {formatKcal(student.latestSnapshot.calorieTargetKcal)}</span>
              </div>
            ) : (
              <span className="text-sm text-text-secondary">
                Ainda sem medições registradas pelo aluno.
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
