const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/**
 * "há 20 minutos" / "há 1 hora" / "há 2 dias" — the relative-time style
 * "Atividade recente" and similar feeds use. Falls back to a plain
 * date once something is more than a week old, where "há 9 dias" stops
 * being more useful than the date itself.
 */
export function formatRelativeTime(date: Date, asOf: Date = new Date()): string {
  const diffMs = asOf.getTime() - date.getTime()

  if (diffMs < MINUTE_MS) return 'agora mesmo'

  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS)
    return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  }

  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS)
    return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  }

  const days = Math.floor(diffMs / DAY_MS)
  if (days < 7) {
    return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
