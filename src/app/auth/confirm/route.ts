import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/infrastructure/auth/supabase/server'

/**
 * Where every auth email link (signup confirmation, password recovery)
 * points. `@supabase/ssr` needs this server-side round trip — unlike the
 * old implicit flow, the verification token never reaches client-side
 * JS as a URL hash fragment the server can't see.
 *
 * Requires the Supabase project's email templates to link here instead
 * of the default `{{ .ConfirmationURL }}`:
 * `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}&next=...`
 * (Authentication → Email Templates in the Supabase dashboard.)
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/'

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

    if (!error) {
      redirect(`${origin}${next}`)
    }
  }

  redirect(`${origin}/login?error=link-invalido`)
}
