import { expect, test } from '@playwright/test'

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
