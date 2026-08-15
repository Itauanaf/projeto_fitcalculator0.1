import { createClient } from '@supabase/supabase-js'
import { expect, test } from '@playwright/test'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const testEmail = `e2e-dashboard-${Date.now()}@fitcalculator-e2e.dev`
const testPassword = 'e2e-test-password-123'

test.beforeAll(async () => {
  await supabaseAdmin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Painel E2E', role: 'STUDENT' },
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

test('a brand-new student sees the onboarding health-profile form, not a blank dashboard', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { name: 'Complete seu perfil de saúde' })).toBeVisible()
})

test('completing the profile, logging a measurement and setting a goal produces a correct, live-recalculated snapshot', async ({
  page,
}) => {
  // Mirrors `calculateHealthMetrics` by hand (not by importing it) so this
  // test actually verifies the pipeline instead of trivially agreeing with it.
  const WEIGHT_KG = 80
  const HEIGHT_CM = 180
  // Birthday is Jan 1st, so by any realistic test-run date this year's
  // birthday has already passed — age is just the year difference.
  const age = new Date().getFullYear() - 1990
  const bmr = Math.round(10 * WEIGHT_KG + 6.25 * HEIGHT_CM - 5 * age + 5)
  const tdee = Math.round(bmr * 1.2) // sedentary activity factor
  const calorieTargetMaintain = tdee
  const calorieTargetLoseWeight = Math.round(tdee * 0.8) // -20% adjustment
  const formatKcal = (value: number) => `${value.toLocaleString('pt-BR')} kcal`

  await page.getByLabel('Data de nascimento').fill('1990-01-01')
  await page.getByLabel('Altura (cm)').fill(String(HEIGHT_CM))
  await page.getByLabel('Sexo utilizado pela equação').selectOption('male')
  await page.getByLabel('Nível de atividade').selectOption('sedentary')
  await page.getByRole('button', { name: 'Salvar perfil' }).click()

  // Before any measurement, the dashboard nudges toward logging one.
  await expect(
    page.getByText('Registre sua primeira medição abaixo para ver seu IMC, TDEE e macros.')
  ).toBeVisible()

  await page.getByLabel('Peso (kg)').fill(String(WEIGHT_KG))
  await page.getByRole('button', { name: 'Registrar medição' }).click()

  // BMI = 80 / 1.80² = 24.69, independent of age/activity/goal.
  await expect(page.getByText('24,69')).toBeVisible()
  await expect(page.getByText(formatKcal(bmr))).toBeVisible()
  // No goal set yet, so the calorie target defaults to maintenance (== TDEE)
  // — the two stats coincide and the formatted value appears twice.
  expect(calorieTargetMaintain).toBe(tdee)
  await expect(page.getByText(formatKcal(tdee))).toHaveCount(2)

  // Setting a -20% goal must recompute the calorie target immediately,
  // without touching the BMI/BMR/TDEE it was already showing.
  await page.getByLabel('Objetivo').selectOption('lose_weight')
  await page.getByRole('button', { name: 'Salvar objetivo' }).click()

  await expect(page.getByRole('heading', { name: 'Alterar objetivo' })).toBeVisible()
  await expect(page.getByText(formatKcal(calorieTargetLoseWeight))).toBeVisible()
  await expect(page.getByText(formatKcal(tdee))).toBeVisible()

  // The measurement history and health-profile edit form both reflect what was saved.
  await expect(page.getByText('80,0kg')).toBeVisible()
  await page.getByText('Editar perfil de saúde').click()
  await expect(page.getByLabel('Data de nascimento')).toHaveValue('1990-01-01')
})
