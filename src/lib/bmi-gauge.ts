/**
 * Maps a BMI value onto a 0–1 fraction for the dashboard's
 * `SemicircleGauge` — purely a display concern (which visual range the
 * arc spans), not a domain calculation, so it lives outside
 * `domain/calculations`. 15–40 covers underweight through obese class
 * 3 without the gauge going nearly empty/full at the edges of the
 * plausible range real measurements fall into.
 */
const GAUGE_MIN_BMI = 15
const GAUGE_MAX_BMI = 40

export function bmiGaugeFraction(bmi: number): number {
  const clamped = Math.min(GAUGE_MAX_BMI, Math.max(GAUGE_MIN_BMI, bmi))
  return (clamped - GAUGE_MIN_BMI) / (GAUGE_MAX_BMI - GAUGE_MIN_BMI)
}
