# Modernize offline caching and Pages deployment

## Why

The build still uses deprecated sw-precache and a compatibility polyfill, and
deployment automation was removed during the Vite migration. Existing users need
their old worker/cache to be replaced without interrupting a running game.

## What Changes

- Generate the production worker with Workbox at the existing service-worker.js URL.
- Precache local game assets, keep hash-route offline access, and delete only the
  known legacy cache for this worker's exact scope after successful activation.
- Activate installed updates without automatically reloading an open game; the
  next page reload uses the new version. Bypass HTTP script cache during update checks.
- Remove sw-precache, its dependency override, and the old cache polyfill.
- Adopt the user's staged pnpm setup, pin its version, and use a frozen lockfile in CI.
- Add a tested-build-to-Pages workflow for master, PR validation, and manual execution.

## Capabilities

### New Capabilities

- `offline-updates`: Scope-safe offline caching and legacy/current worker upgrades.
- `pages-deployment`: Validated pnpm builds deployed via GitHub Pages artifacts.

### Modified Capabilities

- `development-build`: pnpm reproducibility and Workbox generation replace npm/sw-precache.

## Impact

Build script, worker cleanup helper, registration options, package manager files,
Playwright integration tests, Pages workflow, and operating instructions. No live
deployment, push, repository settings change, or gameplay modification is included.
