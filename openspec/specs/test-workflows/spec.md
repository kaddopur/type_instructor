# test-workflows Specification

## Purpose

Define repeatable unit and browser checks, test locations, and the shared CI validation workflow.

## Requirements

### Requirement: Colocated unit tests

Unit tests SHALL use Vitest in a Node environment, reside beside source files as
src/**/*.test.ts, and exclude browser specs. pnpm test and pnpm test:unit SHALL run
the unit suite; pnpm test:unit:watch SHALL provide watch mode.

#### Scenario: Run unit checks

- **WHEN** pnpm test:unit is executed
- **THEN** quiz generation, damage status, routes, and game store tests run without launching a browser

### Requirement: Unified browser tests

Browser tests SHALL reside under tests/e2e and use one Playwright configuration.
The player-flow suite SHALL cover desktop Chromium, Firefox, WebKit, and mobile
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
- **THEN** formatting, lint, type checking, unit tests, and the complete browser suite must pass
- **AND** deployment remains restricted to the existing main publication flow

#### Scenario: Shared quality checks

- **WHEN** the Pages workflow validates a revision
- **THEN** a single `checks` job runs formatting, lint, type checking and unit tests once
- **AND** the two browser matrix jobs start independently in parallel without repeating those checks
- **AND** deployment requires both the shared checks and all browser shards to succeed

#### Scenario: Parallel CI shards

- **WHEN** the Pages workflow runs the complete browser suite
- **THEN** two parallel matrix jobs run Playwright shards 1/2 and 2/2
- **AND** their union includes every browser case without omission or duplication
- **AND** failure in either shard prevents deployment while the other shard completes

### Requirement: Consistent repository formatting

The project SHALL use pinned Prettier and the official Tailwind class-sorting
plugin, with `src/index.css` as the Tailwind theme entry. `pnpm format` SHALL
write formatting changes and `pnpm format:check` SHALL check without writing.
The shared `checks` job SHALL require the formatting check before deployment.
Generated output, the pnpm lockfile, archived OpenSpec records, third-party test
fixtures, fonts and image source assets SHALL be excluded through `.prettierignore`.

#### Scenario: Local and CI formatting

- **WHEN** a contributor runs `pnpm format` followed by `pnpm format:check`
- **THEN** supported maintained source, configuration and documentation files have consistent formatting
- **AND** ESLint remains responsible for code correctness and React Hooks rules

### Requirement: Automatic staged-file checks

Installing development dependencies SHALL install a simple-git-hooks pre-commit
hook. lint-staged SHALL run ESLint fixes, Prettier, then ESLint checks on staged
JavaScript and TypeScript; other supported staged files SHALL use Prettier.
Remaining lint errors SHALL block commits. Unstaged changes SHALL remain outside
commits using lint-staged's default backup and restore behavior.

#### Scenario: Fixable staged changes

- **WHEN** a contributor commits files with formatting or automatically fixable lint issues
- **THEN** the tools fix and stage those changes before the commit completes

#### Scenario: Remaining lint error

- **WHEN** a staged file contains a lint error that ESLint cannot fix
- **THEN** the commit fails and the contributor's staged and unstaged changes remain available

### Requirement: Player-flow E2E scope

Required E2E checks SHALL cover navigation, gameplay completion/replay, exit
confirmation, record persistence, keyboard/touch focus and offline use. Pixel
geometry, font metrics, broad accessibility scans, analytics wiring and exhaustive
algorithm permutations SHALL NOT be required E2E checks. Existing unit coverage
SHALL retain game rules, routes, records and analytics validation.

#### Scenario: Representative player journeys

- **WHEN** the required browser suite runs
- **THEN** all four browser/device projects exercise full basic/speedrun attack/defense games in Traditional Chinese
- **AND** all three languages exercise switching, starting, answering and leaving a game
- **AND** keyboard, pointer/touch focus, records and offline worker upgrades remain covered

#### Scenario: Focused accessibility selection

- **WHEN** `pnpm test:a11y` runs
- **THEN** it checks keyboard and focus journeys, without claiming a broad axe or WCAG audit
