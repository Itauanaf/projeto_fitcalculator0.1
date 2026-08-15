interface DonutSegment {
  value: number
  color: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
}

/** Minimal donut chart, hand-rolled in SVG so the marketing/preview surfaces don't need a charting library. */
export function DonutChart({ segments, size = 96, strokeWidth = 14 }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1

  const dashes = segments.map((segment) => (segment.value / total) * circumference)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {segments.map((segment, index) => {
        const dash = dashes[index]
        const precedingDash = dashes.slice(0, index).reduce((sum, d) => sum + d, 0)

        return (
          <circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-precedingDash}
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}
