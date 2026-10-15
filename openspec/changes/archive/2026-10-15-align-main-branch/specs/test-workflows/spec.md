## MODIFIED Requirements

### Requirement: CI uses the shared test commands

The Pages workflow SHALL run unit checks and one complete browser suite using the
same scripts as local validation before allowing the existing deployment flow.

#### Scenario: CI validation
- **WHEN** the Pages workflow validates a revision
- **THEN** lint, type checking, unit tests, and the complete browser suite must pass
- **AND** deployment remains restricted to the existing main publication flow

#### Scenario: Parallel CI shards
- **WHEN** the Pages workflow runs the complete browser suite
- **THEN** two parallel matrix jobs run Playwright shards 1/2 and 2/2
- **AND** their union includes every browser case without omission or duplication
- **AND** failure in either shard prevents deployment while the other shard completes
