# Verification — part 2

Date: 2026-10-15. Environment: macOS, Node 22.23.2, npm 10.9.8,
installed Google Chrome driven by Playwright 1.64.1.

## Result

Vite 8.3.4 / plugin-react 6.1.2, React and React DOM 19.3.1, Router 8.4.0,
React Redux 9.3.0, and Redux 5.0.1 install and run together without peer overrides.
The committed lockfile uses the public npm registry. Node is pinned in .nvmrc;
package engines require Node 22.22 or newer within the Node 22 release line.

| Check | Evidence |
| --- | --- |
| Clean lockfile install | `npm ci --fetch-retries=0 --fetch-timeout=20000` passed without force or legacy-peer-deps |
| Production logic baseline | `npm test`: 7 passed, 0 failed |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities |
| Development browser smoke | `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev npm run test:smoke`: 3 passed |
| Production build and browser smoke | `PLAYWRIGHT_CHANNEL=chrome npm run test:smoke`: build and all 3 tests passed |

Browser coverage: three languages, homepage/language/menu routes, basic attack and
defense questions, visible answer feedback and score changes, result deep links,
retry resets, paused-before-start timer, 60-second countdown and automatic result
navigation. English/Japanese use a desktop viewport; Chinese uses a 390×844 viewport.
No uncaught page errors were observed by the navigation/resource tests.

Resource coverage: fonts load, manifest and PNG icons resolve under the Pages base,
the production service worker becomes active at /type_instructor/, and a fresh
installation can reload the homepage offline. Development registers no worker.

## Integration decisions

- Router 2 and react-router-redux could not remain as the React 19 integration.
  Modern hash routing was therefore brought forward from step 3; localization
  still uses the existing I18nPage wrapper, now backed by Router hooks.
- The Quiz mount/update lifecycle and timeout cleanup were updated so the existing
  Redux-owned game can run under createRoot. State ownership conversion is deferred;
  the user subsequently selected Zustand for step 3.
- sw-precache remains for step 5. Its meow dependency only uses trim-newlines as a
  function; a scoped override to compatible 3.x removes the reported vulnerability.
  Production generation and browser worker activation pass with the override.
- The obsolete deployment command was removed because it rewrites Git history and
  assumes CRA's build directory. Replacement deployment automation is step 5.
- JSON imports, explicit module extensions, and package type=module let baseline
  tests use native Node ESM; the previous temporary resolution hook was removed.

## Remaining scope

- Step 3: replace Redux/React Redux and class gameplay orchestration with Zustand
  and a game hook; verify repeated inputs and route transitions during feedback.
- Step 4: fix the speedrun defense link and unify the target at 20 points. Neither
  existing defect was fixed or accepted as correct behavior in this change.
- Step 5: replace legacy offline tooling, remove its override/polyfill, verify
  upgrades from an already installed old worker, and configure Pages deployment.
- Step 6: full gameplay acceptance, including speedrun completion, exact feedback
  timing, interruption/race cases, and wider device/browser coverage.

Fresh offline reload is not evidence of old-worker upgrade compatibility. These
tests use local dev/preview servers; no live GitHub Pages deployment was performed.
