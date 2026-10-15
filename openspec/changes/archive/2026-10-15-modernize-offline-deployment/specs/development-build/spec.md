## MODIFIED Requirements

### Requirement: Reproducible installation
The project SHALL declare a supported Node version and pinned pnpm version, use
the public npm registry, and commit a pnpm lockfile so pnpm install --frozen-lockfile
installs the tested dependencies without peer-dependency overrides.

#### Scenario: Clean installation
- **WHEN** a developer runs pnpm install --frozen-lockfile with the declared Node/pnpm versions
- **THEN** dependencies install without force or legacy-peer-deps overrides

### Requirement: Vite commands
The project SHALL provide dev and start commands for Vite development, build for
Vite output plus Workbox generation in dist, preview for production, and test for logic checks.

#### Scenario: Production build
- **WHEN** pnpm build completes
- **THEN** dist contains the application, its static assets, manifest, and a Workbox service worker at service-worker.js
