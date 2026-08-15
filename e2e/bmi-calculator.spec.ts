import { createClient } from '@supabase/supabase-js'
import { expect, test } from '@playwright/test'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Calculators now require an account — see doc principle change: the
// original "no login required" stance was replaced deliberately.
const testEmail = `e2e-bmi-${Date.now()}@fitcalculator-e2e.dev`
const testPassword = 'e2e-test-password-123'

test.beforeAll(async () => {
  await supabaseAdmin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: 'IMC E2E', role: 'STUDENT' },
  })
})

test.afterAll(async () => {
  const { data } = await supabaseAdmin.auth.admin.listUsers()
  const user = data.users.find((u) => u.email === testEmail)
  if (user) await supabaseAdmin.auth.admin.deleteUser(user.id)
})

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(testEmail)
  await page.getByLabel('Senha', { exact: true }).fill(testPassword)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL('/app/aluno')
})

test('calculates BMI from weight and height and shows the result', async ({ page }) => {
  await page.goto('/calculadoras/imc')

  await page.getByLabel(/peso/i).fill('70')
  await page.getByLabel(/altura/i).fill('175')
  await page.getByRole('button', { name: 'Calcular IMC' }).click()

  await expect(page.getByText('22,86')).toBeVisible()
  await expect(page.getByText('Peso normal')).toBeVisible()
})

test('rejects an out-of-range weight with an inline error', async ({ page }) => {
  await page.goto('/calculadoras/imc')

  await page.getByLabel(/peso/i).fill('5')
  await page.getByLabel(/altura/i).fill('175')
  await page.getByRole('button', { name: 'Calcular IMC' }).click()

  // Scoped to the specific field error, not `role=alert` in general — Next.js's
  // own route announcer also has role="alert" and would make this ambiguous.
  await expect(page.getByText('O peso mínimo é 20kg')).toBeVisible()
})

test('a signed-out visitor hitting a calculator is sent to /login and back after signing in', async ({
  page,
}) => {
  // Overrides the logged-in beforeEach for this one case.
  await page.context().clearCookies()

  await page.goto('/calculadoras/imc')
  await expect(page).toHaveURL('/login?next=%2Fcalculadoras%2Fimc')

  await page.getByLabel('E-mail').fill(testEmail)
  await page.getByLabel('Senha', { exact: true }).fill(testPassword)
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL('/calculadoras/imc')
})
