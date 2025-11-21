import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 5173);
const HOST = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'never', // Can change to 'always' to auto-open
    }],
    ['list'], // Keep console output
  ],
  timeout: 120 * 1000,
  use: {
    baseURL: BASE_URL,
    headless: process.env.CI ? true : undefined,
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    video: 'retain-on-failure', // Record video for failed tests (change to 'on' for all tests)
    screenshot: 'only-on-failure', // Capture screenshots on failure
  },
  webServer: {
    command: `pnpm exec vite --host ${HOST} --port ${PORT} --strictPort`,
    url: BASE_URL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
