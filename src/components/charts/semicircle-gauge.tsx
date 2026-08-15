interface SemicircleGaugeProps {
  /** 0–1 fraction of the arc to fill. */
  fraction: number
  size?: number
  strokeWidth?: number
  color?: string
  trackColor?: string
}

/** Half-circle gauge used for the BMI preview (mirrors an "Apple Health"-style ring, but flattened). */
export function SemicircleGauge({
  fraction,
  size = 96,
  strokeWidth = 10,
  color = 'var(--primary)',
  trackColor = 'var(--border)',
}: SemicircleGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const halfCircumference = Math.PI * radius
  const clamped = Math.min(1, Math.max(0, fraction))
  const dash = clamped * halfCircumference
  const path = `M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`

  return (
    <svg
      width={size}
      height={size / 2 + strokeWidth / 2}
      viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}
    >
      <path
        d={path}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${halfCircumference - dash}`}
        strokeLinecap="round"
      />
    </svg>
  )
}
