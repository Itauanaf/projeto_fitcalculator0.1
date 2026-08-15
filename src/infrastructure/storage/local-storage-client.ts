/**
 * Thin, SSR-safe JSON read/write over `localStorage`, shared by every
 * `LocalStorage*Repository` so none of them duplicate the
 * try/catch-and-guard boilerplate. Next.js renders on the server
 * first, where `window` doesn't exist, so every call checks for it.
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function readJson<T>(key: string): T | null {
  if (!isBrowser()) return null

  const raw = window.localStorage.getItem(key)
  if (raw === null) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    // Corrupted or hand-edited value — treat it as absent instead of crashing the app.
    return null
  }
}

export function writeJson(key: string, value: unknown): void {
  if (!isBrowser()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(key)
}
