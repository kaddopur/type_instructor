# Design

Use workbox-build generateSW directly after Vite. This app already has a manifest
and native registration, so it does not need a PWA UI framework or client library.
Generate an inline Workbox runtime and precache local HTML, JS, CSS, fonts, images,
and manifest. Use index.html as the navigation fallback beneath the worker scope.

Keep service-worker.js and /type_instructor/ scope unchanged. skipWaiting and
clientsClaim replace legacy workers without requiring all old tabs to close.
Do not attach a controllerchange reload handler: already loaded game code continues
until the player reloads. Registration uses updateViaCache=none. There are no lazy
application chunks that need to be fetched mid-game.

An imported activation helper deletes only the exact legacy cache name observed
in origin/gh-pages: sw-precache-v2-sw-precache- plus registration.scope. Workbox
owns stale-entry cleanup within its own precache. Disable cleanupOutdatedCaches:
its cache-name substring scan can also match caches belonging to nested scopes.
Never clear all caches or unregister workers.
Failed installation must leave the old active worker and its cache intact.

Use the user's existing pnpm-workspace.yaml and regenerate pnpm-lock.yaml. Pin
pnpm 11.22.0 in packageManager and retain Node .nvmrc. Remove the npm lockfile to
avoid two diverging dependency graphs; update current commands to pnpm.

Workflow: PRs targeting master and pushes to master validate a frozen install,
logic checks, production browser checks, and build. Only master may deploy, using
Pages artifacts and an OIDC deployment job. Manual execution is available; the
repo's Pages source must be GitHub Actions. Publishing requires a later push/merge.

Use a local HTTP fixture server to serve the real archived legacy worker engine
with a reduced fixture asset list, then the actual current build, a generated
second Workbox build, and a deliberately failing build. Browser tests verify
successful replacement, cache isolation, offline gameplay, failed-install recovery,
and no forced reload while a game is open.
