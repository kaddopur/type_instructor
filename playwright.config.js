import { defineConfig } from '@playwright/test';

const development = process.env.SMOKE_SERVER === 'dev';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['smoke.spec.js', 'offline.spec.js', 'accessibility.spec.js'],
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173/type_instructor/',
    browserName: 'chromium',
    ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {})
  },
  webServer: {
    command: development
      ? 'pnpm dev --host 127.0.0.1 --port 4173 --strictPort'
      : 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/type_instructor/',
    reuseExistingServer: false
  }
});
