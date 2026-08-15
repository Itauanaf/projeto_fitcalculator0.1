interface MiniBarChartProps {
  values: number[]
  width?: number
  height?: number
  color?: string
}

/** Tiny bar chart — decorative, not an axis-labeled chart. */
export function MiniBarChart({
  values,
  width = 100,
  height = 32,
  color = 'var(--primary)',
}: MiniBarChartProps) {
  const max = Math.max(...values) || 1
  const gap = 4
  const barWidth = Math.max(2, width / values.length - gap)

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {values.map((value, index) => {
        const barHeight = Math.max(2, (value / max) * height)
        return (
          <rect
            key={index}
            x={index * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={color}
            opacity={0.45 + (index / values.length) * 0.55}
          />
        )
      })}
    </svg>
  )
}
