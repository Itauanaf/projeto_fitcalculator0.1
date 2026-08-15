interface SparklineProps {
  points: number[]
  width?: number
  height?: number
  color?: string
}

/** Tiny trend line — decorative, not an axis-labeled chart. */
export function Sparkline({
  points,
  width = 100,
  height = 32,
  color = 'var(--primary)',
}: SparklineProps) {
  if (points.length < 2) return null

  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)

  const path = points
    .map((point, index) => {
      const x = index * step
      const y = height - ((point - min) / range) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path d={path} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
