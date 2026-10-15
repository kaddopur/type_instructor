# pages-deployment Specification

## Purpose
Define validated master-only GitHub Pages publication through Actions.
## Requirements
### Requirement: Validated Pages artifact
GitHub Actions SHALL install the pinned pnpm version, use its frozen lockfile and
declared Node version, and pass logic and production browser checks before publishing dist.

#### Scenario: Pull request validation
- **WHEN** a pull request targets master
- **THEN** installation, tests, and production build run without deploying

### Requirement: Master-only deployment
Only a successful master build SHALL deploy using official Pages artifacts and
OIDC credentials. The workflow SHALL support manual execution and prevent overlapping deployments.

#### Scenario: Master publication
- **WHEN** a push to master or a manual run on master passes validation
- **THEN** the dist artifact deploys to the github-pages environment

#### Scenario: Manual branch validation
- **WHEN** the workflow is run manually on another branch
- **THEN** it validates that branch without publishing it
#### Scenario: Sharded validation gate
- **WHEN** the two browser validation shards run on master
- **THEN** only shard 1 uploads the Pages artifact
- **AND** deployment waits for both shards to succeed
