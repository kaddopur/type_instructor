import { defineConfig, mergeConfig } from 'vitest/config';
import vite from './vite.config.js';

export default mergeConfig(vite, defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    restoreMocks: true
  }
}));
