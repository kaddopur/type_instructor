import { defineConfig, devices } from '@playwright/test';
import smoke from './playwright.config.js';

export default defineConfig({
  ...smoke,
  testMatch: ['acceptance.spec.js', 'offline.spec.js', 'accessibility.spec.js'],
  workers: process.env.CI ? 2 : 1,
  use: { baseURL: smoke.use.baseURL },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'] } }
  ]
});
