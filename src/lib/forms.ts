/**
 * `react-hook-form`'s `valueAsNumber: true` converts an empty input to
 * `NaN`, not `undefined` — which fails an `optional()` Zod field instead
 * of leaving it unset. Pass this as `setValueAs` on any optional numeric
 * field so leaving it blank is treated as "not provided".
 */
export function asOptionalNumber(raw: string): number | undefined {
  return raw === '' ? undefined : Number(raw)
}
