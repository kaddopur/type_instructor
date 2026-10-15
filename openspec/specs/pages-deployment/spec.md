# pages-deployment Specification

## Purpose

Define validated main-only GitHub Pages publication through Actions.

## Requirements

### Requirement: Validated Pages artifact

GitHub Actions SHALL install the pinned pnpm version, use its frozen lockfile and
declared Node version, and pass logic and production browser checks before publishing dist.

#### Scenario: Pull request validation

- **WHEN** a pull request targets main
- **THEN** installation, tests, and production build run without deploying

### Requirement: Main-only deployment

Only a successful main build SHALL deploy using official Pages artifacts and
OIDC credentials. The workflow SHALL support manual execution and prevent overlapping deployments.

#### Scenario: Main publication

- **WHEN** a push to main or a manual run on main passes validation
- **THEN** the dist artifact deploys to the github-pages environment

#### Scenario: Manual branch validation

- **WHEN** the workflow is run manually on another branch
- **THEN** it validates that branch without publishing it

#### Scenario: Sharded validation gate

- **WHEN** the two browser validation shards run on main
- **THEN** only shard 1 uploads the Pages artifact
- **AND** deployment waits for the shared `checks` job and both shards to succeed
