import { config as loadEnv } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'

// So test files can reach Supabase directly (e.g. to clean up test
// accounts created via the UI) with the same credentials the dev
// server itself uses.
loadEnv({ path: '.env.local' })

/**
 * E2E config. Runs against the dev server for fast local iteration;
 * CI can point this at a production build by setting `PLAYWRIGHT_BASE_URL`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Several specs sign in against the real Supabase project (no mocking).
  // Too many concurrent auth requests contend for Prisma's connection pool
  // and Supabase's API, causing spurious timeouts — capped instead of
  // left to default to one worker per CPU core.
  workers: process.env.CI ? 1 : 3,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
})
