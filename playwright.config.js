import { defineConfig, devices } from '@playwright/test';

const development = process.env.E2E_SERVER === 'dev';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 1,
  use: { baseURL: 'http://127.0.0.1:4173/type_instructor/' },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
      },
    },
    // Each count-based shard gets one WebKit project instead of grouping both together.
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: development
      ? 'pnpm dev --host 127.0.0.1 --port 4173 --strictPort'
      : 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/type_instructor/',
    reuseExistingServer: false,
  },
});
