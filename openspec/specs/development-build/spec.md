# development-build Specification

## Purpose
Document reproducible pnpm installation, Vite builds, and production resource compatibility.
## Requirements
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

### Requirement: React and routing compatibility
The application SHALL mount with createRoot, compatible state bindings, and hash
routing while preserving the existing language-prefixed routes and gameplay baseline.

#### Scenario: Local navigation
- **WHEN** a developer starts the server and opens /type_instructor/
- **THEN** the homepage renders and navigation to the menu and a game works without runtime errors

### Requirement: Base-relative resources
The build SHALL resolve application assets and production service worker registration
beneath /type_instructor/; development SHALL not register the production worker.

#### Scenario: Preview at the Pages path
- **WHEN** the production build is previewed at /type_instructor/
- **THEN** scripts, styles, fonts, icons, manifest, and service worker resolve successfully
