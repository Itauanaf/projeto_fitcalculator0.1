import { signOut } from '@/application/auth/sign-out'
import { Button } from '@/components/ui'

/** A plain Server Component — submitting the form invokes the `signOut` Server Action directly. */
export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary">
        Sair
      </Button>
    </form>
  )
}
