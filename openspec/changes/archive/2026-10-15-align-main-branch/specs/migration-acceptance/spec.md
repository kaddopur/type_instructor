## MODIFIED Requirements

### Requirement: Release evidence
Release SHALL follow passing local and remote validation and record the deployed
revision and live verification. The report SHALL identify tests not executed.

#### Scenario: Pages publication
- **WHEN** the passing migration PR merges to main
- **THEN** the Pages workflow deploys and the published game's asset and gameplay checks pass
