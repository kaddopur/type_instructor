# Verification

2026-10-15; Node 24.19.0 and pnpm 11.22.0.

- `pnpm test:unit`: 23 tests passed across 6 files.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with no warnings.
- `pnpm exec playwright test --workers=4`: 160 passed (1.6 minutes),
  across Chromium, Firefox, desktop WebKit and mobile WebKit projects.
  Production build and local service-worker generation succeeded at startup.
- Browser test listing confirms 80 cases per CI shard.
- `openspec validate migrate-google-analytics-4 --strict`: passed before archive.
- `git diff --check`: passed.

Unit coverage checks initialization, disabled automatic initial views, full hash
URLs, current titles, referrers, duplicate suppression, returning to a page,
queueing without a loaded Google script, and development/local-preview exclusion.
Browser coverage serves the local build under the production hostname, intercepts
and blocks the Google script, and checks page views through home/menu/game/back.
It also checks local previews do not load analytics and no UA snippet remains.
Tests send no Google analytics traffic. Existing gameplay, accessibility, language,
layout and offline regression checks pass.

The code uses Google's documented manual-page-view API. The site owner must
still disable history-based page views in the GA4 data stream, deploy the change,
and verify events arrive in Realtime/DebugView. These account/deployment checks
are pending; local tests prove integration behavior, not GA server receipt.
