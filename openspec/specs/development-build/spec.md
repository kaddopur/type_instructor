# development-build Specification

## Purpose
TBD - created by archiving change migrate-vite-react. Update Purpose after archive.
## Requirements
### Requirement: Reproducible installation
The project SHALL declare a supported Node version, use the public npm registry,
and commit a lockfile so npm ci installs compatible React and build dependencies.

#### Scenario: Clean installation
- **WHEN** a developer runs npm ci with the declared Node version
- **THEN** dependencies install without legacy-peer-deps or force overrides

### Requirement: Vite commands
The project SHALL provide dev and start commands for Vite development, build for
production output in dist, preview for the production build, and test for baseline checks.

#### Scenario: Production build
- **WHEN** npm run build completes
- **THEN** dist contains the application, its static assets, manifest, and the existing generated service worker

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

