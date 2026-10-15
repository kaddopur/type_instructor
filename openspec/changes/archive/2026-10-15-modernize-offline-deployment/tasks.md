## 1. Build and offline migration

- [x] 1.1 Pin pnpm and update its lockfile; remove the npm lock and obsolete offline dependencies.
- [x] 1.2 Generate the production worker with Workbox and scope-safe legacy cleanup.
- [x] 1.3 Preserve production registration URL, disable HTTP script cache for updates, and keep development unregistered.

## 2. Pages automation

- [x] 2.1 Add master/PR/manual validation and master-only artifact deployment.
- [x] 2.2 Document package manager, Pages settings, update behavior, and deployment procedure.

## 3. Verification

- [x] 3.1 Verify legacy-to-Workbox and Workbox-to-Workbox updates, scoped cleanup, and failed-install recovery.
- [x] 3.2 Verify offline gameplay and that updates do not force-reload a running game.
- [x] 3.3 Verify frozen installation, logic tests, development/production browser checks, audit, workflow syntax, and OpenSpec; record limits.
