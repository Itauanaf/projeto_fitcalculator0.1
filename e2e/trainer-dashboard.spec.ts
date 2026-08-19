import { createClient } from '@supabase/supabase-js'
import { expect, test } from '@playwright/test'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const trainerEmail = `e2e-trainer-${Date.now()}@fitcalculator-e2e.dev`
const studentEmail = `e2e-invitee-${Date.now()}@fitcalculator-e2e.dev`
const otherStudentEmail = `e2e-invitee-other-${Date.now()}@fitcalculator-e2e.dev`
// Its own trainer + student pair, kept separate from the ones above —
// `fullyParallel: true` means tests in this file don't run in
// declaration order, so a test can't rely on state another test left
// behind, only on fixtures it fully owns.
const attentionTrainerEmail = `e2e-attention-trainer-${Date.now()}@fitcalculator-e2e.dev`
const attentionStudentEmail = `e2e-attention-student-${Date.now()}@fitcalculator-e2e.dev`
const password = 'e2e-test-password-123'

test.beforeAll(async () => {
  await Promise.all([
    supabaseAdmin.auth.admin.createUser({
      email: trainerEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Personal E2E', role: 'TRAINER' },
    }),
    supabaseAdmin.auth.admin.createUser({
      email: studentEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Aluno Convidado E2E', role: 'STUDENT' },
    }),
    supabaseAdmin.auth.admin.createUser({
      email: otherStudentEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Outro Aluno E2E', role: 'STUDENT' },
    }),
    supabaseAdmin.auth.admin.createUser({
      email: attentionTrainerEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Personal Atenção E2E', role: 'TRAINER' },
    }),
    supabaseAdmin.auth.admin.createUser({
      email: attentionStudentEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Aluno Atenção E2E', role: 'STUDENT' },
    }),
  ])
})

test.afterAll(async () => {
  const { data } = await supabaseAdmin.auth.admin.listUsers()
  const toDelete = data.users.filter((u) =>
    [
      trainerEmail,
      studentEmail,
      otherStudentEmail,
      attentionTrainerEmail,
      attentionStudentEmail,
    ].includes(u.email ?? '')
  )
  await Promise.all(toDelete.map((u) => supabaseAdmin.auth.admin.deleteUser(u.id)))
})

/** Switches to a different account mid-test — clears cookies first rather than relying on a
 *  "Sair" button being present on whatever page the test happens to be on. */
async function login(page: import('@playwright/test').Page, email: string) {
  await page.context().clearCookies()
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('inviting a student, accepting the invite and seeing it reflected on both dashboards', async ({
  page,
}) => {
  await login(page, trainerEmail)
  await expect(page).toHaveURL('/app/personal')

  await page.getByLabel('E-mail do aluno').fill(studentEmail)
  await page.getByRole('button', { name: 'Gerar convite' }).click()

  const inviteUrl = await page.locator('code').textContent()
  expect(inviteUrl).toContain('/convite/')
  await expect(page.getByText(studentEmail)).toBeVisible()
  await expect(page.getByText('Aguardando resposta')).toBeVisible()

  // A different student than the one invited must not be able to accept.
  await login(page, otherStudentEmail)
  await expect(page).toHaveURL('/app/aluno')
  await page.goto(inviteUrl!.trim())
  await expect(page.getByText('um e-mail diferente do da sua conta atual')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Aceitar convite' })).toHaveCount(0)

  // The invited student accepts it.
  await login(page, studentEmail)
  await expect(page).toHaveURL('/app/aluno')
  await page.goto(inviteUrl!.trim())
  await expect(page.getByRole('heading', { name: 'Convite de Personal E2E' })).toBeVisible()
  await page.getByRole('button', { name: 'Aceitar convite' }).click()
  // `acceptInvitation` chains several sequential Supabase Auth + DB round
  // trips (session check, invitation lookup, email check, transaction) —
  // slower than a plain login under the suite's concurrent worker load.
  await expect(page).toHaveURL('/app/aluno', { timeout: 15000 })

  // Re-visiting the same link afterward reports it as already used.
  await page.goto(inviteUrl!.trim())
  await expect(page.getByText('Este convite já foi aceito.')).toBeVisible()

  // The trainer now sees the student linked, with the invitation marked accepted.
  await login(page, trainerEmail)
  await expect(page).toHaveURL('/app/personal')
  // A freshly-linked student with no health profile also shows up in the
  // "Precisam de atenção" section, so the name legitimately appears
  // twice on the page now — `.first()` is the Attention Section's entry.
  await expect(page.getByText('Aluno Convidado E2E').first()).toBeVisible()
  // `{ exact: true }` — the "Convites aceitos" stat-card label would otherwise also match.
  await expect(page.getByText('Aceito', { exact: true })).toBeVisible()

  // Clicking the student (either row links to the same detail page) opens
  // it, showing the same "no measurement yet" nudge their own dashboard would show.
  await page.getByText('Aluno Convidado E2E').first().click()
  await expect(page).toHaveURL(/\/app\/personal\/alunos\/.+/)
  await expect(page.getByRole('heading', { name: 'Aluno Convidado E2E' })).toBeVisible()
  await expect(
    page.getByText('Registre sua primeira medição abaixo para ver seu IMC, TDEE e macros.')
  ).toBeVisible()
  await expect(page.getByText('Este aluno ainda não completou o perfil de saúde.')).toBeVisible()
  await expect(page.getByText('Este aluno ainda não definiu um objetivo.')).toBeVisible()

  // Accepting an invite seeds a default weekly check-in schedule — a
  // trainer shouldn't have to visit and save the form once just to get one.
  await expect(page.getByLabel('Frequência')).toHaveValue('weekly')
  await expect(page.getByText('Próximo check-in:')).toBeVisible()

  await page.getByLabel('Frequência').selectOption('monthly')
  await page.getByRole('button', { name: 'Salvar' }).click()
  await page.waitForTimeout(1000)
  await page.reload()
  await expect(page.getByLabel('Frequência')).toHaveValue('monthly')
})

test('attention flags, status badges and the activity feed reflect real student data', async ({
  page,
}) => {
  // Its own trainer + student pair (see the note by their declaration) —
  // links them from scratch rather than relying on another test's state.
  await login(page, attentionTrainerEmail)
  await expect(page).toHaveURL('/app/personal')
  await page.getByLabel('E-mail do aluno').fill(attentionStudentEmail)
  await page.getByRole('button', { name: 'Gerar convite' }).click()
  const inviteUrl = await page.locator('code').textContent()

  await login(page, attentionStudentEmail)
  await expect(page).toHaveURL('/app/aluno')
  await page.goto(inviteUrl!.trim())
  await page.getByRole('button', { name: 'Aceitar convite' }).click()
  await expect(page).toHaveURL('/app/aluno', { timeout: 15000 })

  await login(page, attentionTrainerEmail)
  await expect(page).toHaveURL('/app/personal')
  await expect(page.getByText('Perfil incompleto')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Atividade recente' })).toHaveCount(0)

  // The student completes their profile, logs a measurement and sets a
  // goal whose target is the weight already on file — met the instant
  // it's saved, the simplest way to exercise `goal_reached`.
  await login(page, attentionStudentEmail)
  await expect(page).toHaveURL('/app/aluno')
  await page.getByLabel('Data de nascimento').fill('1990-01-01')
  await page.getByLabel('Altura (cm)').fill('180')
  await page.getByLabel('Sexo utilizado pela equação').selectOption('male')
  await page.getByLabel('Nível de atividade').selectOption('sedentary')
  await page.getByRole('button', { name: 'Salvar perfil' }).click()

  const measurementForm = page.locator('form').filter({
    has: page.getByRole('button', { name: 'Registrar medição' }),
  })
  await expect(measurementForm.getByLabel('Peso (kg)')).toBeVisible({ timeout: 15000 })
  await measurementForm.getByLabel('Peso (kg)').fill('80')
  await measurementForm.getByRole('button', { name: 'Registrar medição' }).click()
  await expect(page.getByText('24,69')).toHaveCount(2, { timeout: 15000 })

  await page.getByLabel('Objetivo').selectOption('maintain')
  await page.getByRole('button', { name: 'Salvar objetivo' }).click()
  await expect(page.getByRole('heading', { name: 'Alterar objetivo' })).toBeVisible({
    timeout: 15000,
  })
  await page.getByLabel('Peso alvo').fill('80')
  await page.getByRole('button', { name: 'Salvar objetivo' }).click()
  await expect(page.getByRole('heading', { name: 'Meta: Manutenção de peso' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByText('100% concluído')).toBeVisible()

  await login(page, attentionTrainerEmail)
  await expect(page).toHaveURL('/app/personal')

  // Completing the profile clears that flag; the goal being met raises a new one.
  await expect(page.getByText('Perfil incompleto')).toHaveCount(0)
  // Appears twice — once as the attention-item description, once as the student's status badge.
  await expect(page.getByText('Meta atingida')).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Ver progresso' })).toBeVisible()

  // The measurement and the goal change both surface in the activity feed.
  // (The goal entry legitimately appears twice — saving the type and later
  // adding the target weight are two separate `setGoal` calls.)
  await expect(page.getByRole('heading', { name: 'Atividade recente' })).toBeVisible()
  await expect(page.getByText('Aluno Atenção E2E registrou novo peso')).toBeVisible()
  await expect(
    page.getByText('Objetivo de Aluno Atenção E2E alterado para Manutenção de peso').first()
  ).toBeVisible()
})

test("a trainer cannot open a student detail page they aren't linked to", async ({ page }) => {
  await login(page, trainerEmail)
  await expect(page).toHaveURL('/app/personal')

  // `otherStudentEmail` was never invited/linked to this trainer.
  await page.goto('/app/personal/alunos/00000000-0000-0000-0000-000000000000')
  await expect(page).toHaveURL('/app/personal')
})

test('a student cannot open the trainer-only student-detail route', async ({ page }) => {
  await login(page, otherStudentEmail)
  await expect(page).toHaveURL('/app/aluno')

  await page.goto('/app/personal/alunos/00000000-0000-0000-0000-000000000000')
  await expect(page).toHaveURL('/app/aluno')
})

test('a signed-out visitor hitting an invite link is sent to /login and back', async ({ page }) => {
  await login(page, trainerEmail)
  await page.getByLabel('E-mail do aluno').fill(`e2e-redirect-${Date.now()}@fitcalculator-e2e.dev`)
  await page.getByRole('button', { name: 'Gerar convite' }).click()
  const inviteUrl = await page.locator('code').textContent()

  await page.context().clearCookies()
  await page.goto(inviteUrl!.trim())
  await expect(page).toHaveURL(/\/login\?next=/)
})

test('an unknown invite token shows a clear not-found message', async ({ page }) => {
  await page.goto('/convite/this-token-does-not-exist')
  await expect(page.getByText('Convite não encontrado.')).toBeVisible()
})
