import { expect, test } from '@playwright/test'

test('home page loads with the FitCalculator brand and nav', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('IMC, TDEE')
  await expect(page.locator('nav[aria-label="Principal"]')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Criar conta' }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar' }).first()).toBeVisible()
})

test('home page shows the three calculators as informational, non-clickable cards', async ({
  page,
}) => {
  await page.goto('/')

  const section = page.locator('#calculadoras')
  await section.scrollIntoViewIfNeeded()

  for (const title of ['Calculadora de IMC', 'Gasto energético diário', 'Macronutrientes']) {
    await expect(section.getByRole('heading', { name: title })).toBeVisible()
  }

  // The cards are purely informational — no links into the calculators
  // from this section (an account is required, so nothing here navigates).
  for (const href of ['/calculadoras/imc', '/calculadoras/tdee', '/calculadoras/macros']) {
    await expect(section.locator(`a[href="${href}"]`)).toHaveCount(0)
  }
})
