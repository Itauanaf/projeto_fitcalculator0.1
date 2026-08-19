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

  // Scoped to the measurement form — the check-in form (added later on
  // this same page) also has a "Peso (kg)" field.
  const measurementForm = page.locator('form').filter({
    has: page.getByRole('button', { name: 'Registrar medição' }),
  })
  await measurementForm.getByLabel('Peso (kg)').fill(String(WEIGHT_KG))
  await measurementForm.getByRole('button', { name: 'Registrar medição' }).click()

  // BMI = 80 / 1.80² = 24.69, independent of age/activity/goal. Shown twice
  // (the KPI tile and the BMI gauge card both display it).
  await expect(page.getByText('24,69')).toHaveCount(2)
  await expect(page.getByText(formatKcal(bmr))).toBeVisible()
  // No goal set yet, so the calorie target defaults to maintenance (== TDEE)
  // — the two stats coincide and the formatted value appears twice.
  expect(calorieTargetMaintain).toBe(tdee)
  await expect(page.getByText(formatKcal(tdee))).toHaveCount(2)

  // Setting a -20% goal must recompute the calorie target immediately,
  // without touching the BMI/BMR/TDEE it was already showing.
  await page.getByLabel('Objetivo').selectOption('lose_weight')
  await page.getByRole('button', { name: 'Salvar objetivo' }).click()

  // `setGoal` now does one more sequential DB round trip than a plain
  // save (reading the latest measurement to capture `initialWeightKg`).
  await expect(page.getByRole('heading', { name: 'Alterar objetivo' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByText(formatKcal(calorieTargetLoseWeight))).toBeVisible()
  await expect(page.getByText(formatKcal(tdee))).toBeVisible()

  // The measurement history and health-profile edit form both reflect what was
  // saved. `{ exact: true }` — the timeline's "Nova medição — Peso: 80,0kg" entry also contains this text.
  await expect(page.getByText('80,0kg', { exact: true })).toBeVisible()
  await page.getByText('Editar perfil de saúde').click()
  await expect(page.getByLabel('Data de nascimento')).toHaveValue('1990-01-01')

  // Without a target weight yet, there's nothing to show progress toward.
  await expect(page.getByText('Peso inicial')).toHaveCount(0)

  // Adding a target weight + deadline captures `initialWeightKg` from the
  // measurement already on file (80kg) and starts the progress card.
  await page.getByLabel('Peso alvo').fill('75')
  await page.getByLabel('Prazo').fill('2027-01-01')
  await page.getByRole('button', { name: 'Salvar objetivo' }).click()

  await expect(page.getByRole('heading', { name: 'Meta: Emagrecimento' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByText('0% concluído')).toBeVisible()

  // Logging a second, lower weight advances progress: (80-78)/(80-75) = 40%.
  await measurementForm.getByLabel('Peso (kg)').fill('78')
  await measurementForm.getByRole('button', { name: 'Registrar medição' }).click()

  await expect(page.getByText('40% concluído')).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('-2,0kg desde o início.')).toBeVisible()

  // The evolution chart and timeline both reflect the same two measurements.
  // (`-2,0kg` legitimately appears more than once — the chart's "Diferença"
  // stat and the measurement history's inline trend badge both show it.)
  await expect(page.getByRole('heading', { name: 'Evolução do peso' })).toBeVisible()
  await expect(page.getByText('-2,0kg', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Timeline de evolução' })).toBeVisible()
  await expect(page.getByText('Nova medição — Peso: 78,0kg')).toBeVisible()
  await expect(page.getByText('Objetivo atualizado — Emagrecimento')).toBeVisible()

  // The target date round-trips through the goal form correctly (UTC-anchored, no off-by-one).
  await expect(page.getByLabel('Prazo')).toHaveValue('2027-01-01')

  // A check-in creates a measurement + records the subjective fields in
  // one go — represented as a single timeline entry, not two.
  const checkInForm = page.locator('form').filter({
    has: page.getByRole('button', { name: 'Enviar check-in' }),
  })
  await checkInForm.getByLabel('Peso (kg)').fill('76')
  const ratingGroups = await checkInForm.getByRole('radiogroup').all()
  await ratingGroups[0].getByRole('radio', { name: '5 de 5' }).click() // energia
  await ratingGroups[1].getByRole('radio', { name: '2 de 5' }).click() // fome
  await ratingGroups[2].getByRole('radio', { name: '4 de 5' }).click() // sono
  await checkInForm.getByLabel('Treinos realizados na semana').fill('5')
  await checkInForm.getByLabel('Aderência à alimentação').fill('90')
  await checkInForm.getByRole('button', { name: 'Enviar check-in' }).click()

  await expect(checkInForm.getByText('Check-in registrado.')).toBeVisible({ timeout: 15000 })
  // (80-76)/(80-75) = 80%.
  await expect(page.getByText('80% concluído')).toBeVisible()
  await expect(
    page.getByText('Novo check-in — Peso: 76,0kg · Energia 5/5 · Sono 4/5 · Aderência 90%')
  ).toBeVisible()
  // The check-in's own measurement isn't also listed as a separate "Nova medição" entry.
  await expect(page.getByText('Nova medição — Peso: 76,0kg')).toHaveCount(0)
})
