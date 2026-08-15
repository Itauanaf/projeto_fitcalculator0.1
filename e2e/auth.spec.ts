import { createClient } from '@supabase/supabase-js'
import { expect, test } from '@playwright/test'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEST_PASSWORD = 'e2e-test-password-123'

// Supabase's signup validator rejects reserved/placeholder domains like
// example.com and example.org — this one isn't on that list.
function uniqueTestEmail(prefix: string): string {
  return `${prefix}-${Date.now()}@fitcalculator-e2e.dev`
}

async function deleteTestUserByEmail(email: string): Promise<void> {
  const { data } = await supabaseAdmin.auth.admin.listUsers()
  const user = data.users.find((u) => u.email === email)
  if (user) await supabaseAdmin.auth.admin.deleteUser(user.id)
}

test('the role selector in the sign-up form is actually clickable', async ({ page }) => {
  await page.goto('/cadastro')

  const studentRadio = page.getByRole('radio', { name: /Sou aluno/ })
  const trainerRadio = page.getByRole('radio', { name: /Sou personal trainer/ })

  await expect(studentRadio).toBeChecked()
  // The input is visually hidden (its label is the clickable surface) —
  // `force` skips Playwright's visibility check, matching how a real
  // click on the label toggles it.
  await trainerRadio.check({ force: true })
  await expect(trainerRadio).toBeChecked()
  await expect(studentRadio).not.toBeChecked()
})

// Skipped: Supabase's free-tier built-in email sender has a very low
// send-rate limit (confirmed via a direct signUp() call during
// development: `over_email_send_rate_limit`, HTTP 429), and this
// project's "Confirm email" setting means every real signUp() attempt
// tries to send one. Re-enable once a custom SMTP provider is
// configured (Supabase dashboard → Authentication → SMTP Settings),
// which lifts the limit.
test.skip('a valid sign-up shows the "check your email" message (this project requires email confirmation)', async ({
  page,
}) => {
  const email = uniqueTestEmail('e2e-signup')

  await page.goto('/cadastro')
  await page.getByLabel('Nome completo').fill('Aluno E2E')
  await page.getByLabel('E-mail').fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(TEST_PASSWORD)
  await page.getByLabel('Confirmar senha').fill(TEST_PASSWORD)
  await page.getByRole('button', { name: 'Criar conta' }).click()

  await expect(page.getByRole('heading', { name: 'Confira seu e-mail' })).toBeVisible()

  await deleteTestUserByEmail(email)
})

test.describe("signed-in flows (pre-confirmed test accounts, created via the admin API to avoid Supabase's email-sending rate limit)", () => {
  const studentEmail = uniqueTestEmail('e2e-login-student')
  const trainerEmail = uniqueTestEmail('e2e-login-trainer')

  test.beforeAll(async () => {
    await supabaseAdmin.auth.admin.createUser({
      email: studentEmail,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Aluno Login E2E', role: 'STUDENT' },
    })
    await supabaseAdmin.auth.admin.createUser({
      email: trainerEmail,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Personal Login E2E', role: 'TRAINER' },
    })
  })

  test.afterAll(async () => {
    await deleteTestUserByEmail(studentEmail)
    await deleteTestUserByEmail(trainerEmail)
  })

  test('a student logs in, lands on the student dashboard, and logs out', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(studentEmail)
    await page.getByLabel('Senha', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/app/aluno')
    await expect(page.getByRole('heading', { name: /Olá, Aluno Login E2E/ })).toBeVisible()

    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('a trainer logs in and lands on the trainer dashboard, not the student one', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(trainerEmail)
    await page.getByLabel('Senha', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page).toHaveURL('/app/personal')
  })

  test('a student cannot open the trainer dashboard — sent back to their own', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-mail').fill(studentEmail)
    await page.getByLabel('Senha', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/app/aluno')

    await page.goto('/app/personal')
    await expect(page).toHaveURL('/app/aluno')
  })
})

test('a signed-out visitor hitting a dashboard route is sent to /login', async ({ page }) => {
  await page.goto('/app/aluno')
  await expect(page).toHaveURL('/login')
})
