# Verification — part 3

Date: 2026-10-15. Environment: macOS, Node 22.23.2, npm 10.9.8,
Google Chrome driven by Playwright 1.64.1.

## Result

Zustand 5.0.15 owns game-session state. redux, react-redux, their Provider/connect
wiring, action creators, and reducers have been removed from runtime source and
package manifest/lockfile. Each game creates a vanilla store and subscribes through
useStore. Static language dictionaries are selected by I18nPage using URL params.

| Check | Result |
| --- | --- |
| `npm ci --fetch-retries=0 --fetch-timeout=20000` | Passed without peer-dependency overrides |
| `npm test` | 11 passed, 0 failed |
| `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev npm run test:smoke` | 5 passed under React StrictMode |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke` | Production build and all 5 tests passed |
| `npm audit --audit-level=high` | 0 vulnerabilities |
| OpenSpec strict validation and git whitespace check | Passed |

## Covered behavior

- Existing 18-type attack/defense question invariants and representative matchups.
- New-session state for both game modes and both question types; immutable scoring
  updates, negative scores, feedback categories, wrong-answer retries, next questions.
- Action guards before start, during feedback, after completion, for invalid indices,
  and for previously selected options; atomic completion snapshots and session isolation.
- Speedrun preserves the integer seconds captured at the final correct answer,
  even if the timer advances while its feedback is displayed.
- Three-language navigation, existing result URLs and retry behavior, desktop and
  mobile viewport smoke checks, 60-second countdown and result navigation.
- Synchronous repeated clicks, feedback still active at 499 ms and cleared at 500 ms,
  direct same-document mode changes during feedback, fresh speedrun state, and leaving
  while feedback is pending without later navigation into an old result.
- Speedrun completion and retry at the configured goal. Tests import SCORE_TARGET
  rather than accepting the known incorrect numeric target as a gameplay requirement.
- Existing Pages-base assets, worker activation, fresh offline homepage reload;
  no service worker registration in development.

The route key replaces the session store when pathname changes. Timer and feedback
effects return cleanup functions, and their dependencies do not restart feedback
on each timer tick. All development browser checks run with root StrictMode enabled.

## Remaining scope

- Step 4 still owns BUG-01 (speedrun defense menu link) and BUG-02 (3-point runtime
  target versus 20-point localized instructions). The defense speedrun test enters
  via its correct deep link, and does not mask the incorrect menu link.
- Step 5 still owns replacing sw-precache, upgrading old installed workers, and
  deployment automation. Its existing scoped transitive override remains.
- Full multi-browser/device acceptance, live Pages deployment, and the corrected
  19/20-point boundary remain later steps. No persistence or cross-device state was added.

Implementation verification preceded the user's subsequent archive and commit
request. This change was archived as 2026-10-15-replace-redux-with-zustand.
No deployment was performed.
