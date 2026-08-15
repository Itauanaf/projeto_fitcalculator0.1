import type { CalculationType } from '../value-objects/calculation-type'

/**
 * A single history entry: one calculator run, with enough context
 * (input, result, formula + version) to be replayed or audited later
 * without recomputing from a value that may since have changed.
 */
export interface Calculation {
  id: string
  type: CalculationType
  input: Record<string, unknown>
  result: Record<string, unknown>
  formula: string
  formulaVersion: string
  createdAt: string
}
