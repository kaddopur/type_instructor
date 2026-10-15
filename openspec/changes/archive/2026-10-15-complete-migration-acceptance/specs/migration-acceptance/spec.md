## ADDED Requirements

### Requirement: Complete game matrix
Acceptance checks SHALL cover English, Chinese, and Japanese in basic/speedrun
attack/defense modes, including actual completion, results, retry, and preserved language.

#### Scenario: Complete a game
- **WHEN** the acceptance suite runs against the production build
- **THEN** every language/mode combination reaches a correct result and starts a clean replay

### Requirement: Browser and layout coverage
Acceptance SHALL verify desktop Chromium, Firefox, WebKit, and mobile WebKit emulation,
with all answer choices visible and operable. Reports SHALL distinguish emulation from physical devices.

#### Scenario: Answer visibility
- **WHEN** a game is shown in a supported test viewport
- **THEN** all four choices fit inside the game viewport without clipping

### Requirement: Release evidence
Release SHALL follow passing local and remote validation and record the deployed
revision and live verification. The report SHALL identify tests not executed.

#### Scenario: Pages publication
- **WHEN** the passing migration PR merges to master
- **THEN** the Pages workflow deploys and the published game's asset and gameplay checks pass
