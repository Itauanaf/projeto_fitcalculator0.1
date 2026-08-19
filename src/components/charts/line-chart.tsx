interface LineChartProps {
  points: number[]
  width?: number
  height?: number
  color?: string
}

/**
 * A line chart with a soft gradient fill under the curve — the weight
 * evolution chart's main visual. Still not axis-labeled (the stat
 * callouts around it carry the actual numbers), just bigger and more
 * legible than `Sparkline`, which stays reserved for small inline trends.
 */
export function LineChart({
  points,
  width = 400,
  height = 160,
  color = 'var(--primary)',
}: LineChartProps) {
  if (points.length < 2) return null

  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)
  const padding = 8

  const coords = points.map((point, index) => {
    const x = index * step
    const y = padding + (1 - (point - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const linePath = coords
    .map((c, index) => `${index === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ')

  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`

  const gradientId = 'line-chart-fill'

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c, index) => (
        <circle
          key={index}
          cx={c.x}
          cy={c.y}
          r={index === 0 || index === coords.length - 1 ? 4 : 2.5}
          fill={color}
          stroke="white"
          strokeWidth={index === 0 || index === coords.length - 1 ? 2 : 0}
        />
      ))}
    </svg>
  )
}
