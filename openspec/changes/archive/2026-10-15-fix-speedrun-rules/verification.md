# Verification — part 4

Date: 2026-10-15. Environment: macOS, Node 22.23.2, npm 10.9.8,
Google Chrome driven by Playwright 1.64.1.

## Result

BUG-01 and BUG-02 are fixed. The defense speedrun entry uses speedrun/defend;
SCORE_TARGET is defined once as 20 in src/lib/gameRules.js and imported by the
store and Quiz. All three GOAL_SPEEDRUN strings use {scoreTarget}, substituted
at render time. No dependencies or lockfile changed.

| Check | Result |
| --- | --- |
| `npm test` | 12 passed, 0 failed |
| `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev npm run test:smoke` | 6 passed under StrictMode |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke` | Production build and all 6 browser tests passed |
| OpenSpec strict validation and whitespace check | Passed |

## Regression evidence

- Store tests explicitly require the target to equal 20. For attack and defense,
  answering from 18 reaches 19 without completing; a wrong answer deducts a point,
  recovery to 19 still continues, and only 20 completes after advance/feedback.
- Existing completion tests preserve the final answer's integer seconds and reject
  input after completion. General-mode scoring, timing, and question tests still pass.
- Browser tests click both speedrun links in English, Chinese, and Japanese and
  assert the exact route, corresponding attack/defense stem, zero initial timer,
  and correctly formatted 20-point goal without an unresolved placeholder.
- The browser completion test enters defense via the menu, plays through 19 and
  20 points, stays in-game at 19 and at 499 ms after the final answer, then enters
  the result after 500 ms. Final answer time, clean retry, and leaving during
  pending feedback remain verified.
- Existing three-language basic games, session isolation, resource-path checks,
  worker activation, and fresh offline homepage reload still pass.

## Remaining scope

Step 5 owns offline tooling replacement, updates from an old installed service
worker, and Pages deployment automation. Step 6 owns complete device/browser
acceptance. Implementation verification preceded the user's archive and commit
request. This change was archived as 2026-10-15-fix-speedrun-rules.
No deployment was performed.
