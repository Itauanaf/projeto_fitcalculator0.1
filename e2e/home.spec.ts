import { expect, test } from '@playwright/test'

test('home page loads with the FitCalculator brand and nav', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('IMC, TDEE')
  await expect(page.locator('nav[aria-label="Principal"]')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Começar agora' }).first()).toBeVisible()
})

test('home page links to all three calculators', async ({ page }) => {
  await page.goto('/')

  for (const href of ['/calculadoras/imc', '/calculadoras/tdee', '/calculadoras/macros']) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
  }
})
