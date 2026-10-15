## ADDED Requirements

### Requirement: Colocated unit tests

Unit tests SHALL use Vitest in a Node environment, reside beside source files as
src/**/*.test.ts, and exclude browser specs. pnpm test and pnpm test:unit SHALL run
the unit suite; pnpm test:unit:watch SHALL provide watch mode.

#### Scenario: Run unit checks
- **WHEN** pnpm test:unit is executed
- **THEN** quiz generation, damage status, routes, and game store tests run without launching a browser

### Requirement: Unified browser tests

Browser tests SHALL reside under tests/e2e and use one Playwright configuration.
The complete suite SHALL cover desktop Chromium, Firefox, WebKit, and mobile
WebKit emulation. Tags SHALL support smoke, gameplay, accessibility, and offline selection.

#### Scenario: Complete browser acceptance
- **WHEN** pnpm test:e2e is executed
- **THEN** all browser projects run against a production build at /type_instructor/

#### Scenario: Development smoke check
- **WHEN** E2E_SERVER=dev pnpm test:e2e:smoke is executed
- **THEN** only Chromium smoke cases run against the development server

### Requirement: CI uses the shared test commands

The Pages workflow SHALL run unit checks and one complete browser suite using the
same scripts as local validation before allowing the existing deployment flow.

#### Scenario: CI validation
- **WHEN** the Pages workflow validates a revision
- **THEN** lint, type checking, unit tests, and the complete browser suite must pass
- **AND** deployment remains restricted to the existing master publication flow
