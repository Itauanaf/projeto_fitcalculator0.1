import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for Client Components. Cookie handling is automatic —
 * `@supabase/ssr` reads/writes the auth cookies itself, so nothing needs
 * to be wired up here beyond the project URL/key.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
