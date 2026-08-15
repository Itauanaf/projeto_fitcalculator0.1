import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase client for Server Components, Server Actions and Route
 * Handlers. Writing cookies only actually works from a Server Action or
 * Route Handler — Next.js forbids it during a Server Component's
 * render, so `setAll` swallows that specific failure. This is safe
 * because `middleware.ts` refreshes the session (and rewrites its
 * cookies) on every request regardless.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Called during a Server Component render — see the doc comment above.
          }
        },
      },
    }
  )
}
