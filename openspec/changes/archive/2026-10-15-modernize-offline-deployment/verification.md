# Verification — step 5

Date: 2026-10-15. Local environment: macOS, Node 22.23.2, pnpm 11.22.0,
Google Chrome driven by Playwright 1.64.1. Workbox build version: 7.4.1.

## Result

The build now uses Workbox to generate service-worker.js with an inline runtime
and 11 precached local resources. The old URL and /type_instructor/ scope remain.
sw-precache, its trim-newlines override, and cache-polyfill.js have been removed.

The user's staged pnpm workspace settings were retained. packageManager pins
pnpm 11.22.0; pnpm-lock.yaml is updated and package-lock.json is removed. Scripts,
Playwright server commands, current documentation, and CI use pnpm.

| Check | Evidence |
| --- | --- |
| Clean installation | Removed generated node_modules, then `pnpm install --frozen-lockfile`: passed with no force/peer overrides |
| Logic tests | `pnpm test`: 12 passed |
| Production build | `pnpm build`: Vite output plus Workbox generation passed |
| Production browser tests | `PLAYWRIGHT_CHANNEL=chrome pnpm test:smoke`: 7 passed |
| Development browser tests | `PLAYWRIGHT_CHANNEL=chrome SMOKE_SERVER=dev pnpm test:smoke`: 6 passed, worker-upgrade test intentionally skipped |
| Dependency audit | `pnpm audit --audit-level=high`: no known vulnerabilities |
| Workflow validation | actionlint v1.7.12 passed for .github/workflows/pages.yml; optional shellcheck integration disabled |
| OpenSpec / whitespace | Strict validation and git diff --check passed |

## Worker upgrade evidence

tests/fixtures/legacy-service-worker.js preserves the generated worker engine
from gh-pages commit fbecea9e343cf177c4a4641dd8e5f74c5fa3d47e. Only the precache list
is reduced to an index.html fixture. A real local HTTP server serves successive
builds under the same worker URL and scope; Playwright does not mock SW lifecycle.

The production test verifies:

1. The archived worker installs, controls a legacy page, and stores its cache.
2. A generated Workbox build referencing a deliberately removed precache asset fails
   to install, leaving the legacy cache active and the legacy page available offline.
3. The actual current worker activates, deletes the exact legacy cache, and keeps
   the current document open until explicit reload; the reload displays the new app.
4. The new app can reload, navigate to Chinese defense mode, and answer offline.
5. A second generated Workbox build changes index.html's revision and activates while
   a game is open without changing its URL or score; explicit reload uses the new
   build, and the updated build also reloads offline.
6. Root-level unrelated and nested-app cache names and their stored contents survive
   both updates; no duplicate worker registration is introduced.

Workbox cleanupOutdatedCaches is deliberately disabled because its substring
matching also includes nested scopes. Workbox still removes stale entries from
its own precache on activation. The legacy cleanup helper deletes only the exact
sw-precache-v2-sw-precache-<registration.scope> name observed in the archived build.

## Pages workflow and current remote state

The workflow validates PRs targeting master, pushes to master, and manual runs.
It installs Node from .nvmrc, pinned pnpm with a frozen lockfile, runs logic and
production browser checks, and uploads dist only for master deployment. The separate
OIDC deployment job uses the github-pages environment and serializes deployments.
Other branches' manual runs cannot publish. Actions are pinned to commit SHAs.

A read-only `gh api repos/kaddopur/type_instructor/pages` check returned build_type
legacy, source branch gh-pages, path /, URL https://kaddopur.github.io/type_instructor/.
No repository setting was changed. Before using the workflow to publish, merge the
reviewed change into master, switch Settings → Pages → Source to GitHub Actions,
and run the workflow on master. Instructions are in README.

## Limits and handoff

Local Chrome and real local HTTP fixtures validate worker behavior, not the
complete archived 2016 frontend or an existing user's browser profile. No Linux
GitHub Actions execution, live deployment, or broad multi-browser acceptance was
performed. Full acceptance remains step 6. Workbox's installed glob dependency
reports deprecation, while the current dependency audit reports no known vulnerabilities.

Implementation verification preceded the user's subsequent archive and commit
request. This change was archived as 2026-10-15-modernize-offline-deployment.
No push, deployment, or Pages settings change was performed.
