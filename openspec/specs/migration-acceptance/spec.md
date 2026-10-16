# migration-acceptance Specification

## Purpose

Define representative player journeys, browser coverage and verified-release acceptance.

## Requirements

### Requirement: Complete game matrix

Acceptance checks SHALL cover full basic/speedrun attack/defense completion,
results and retry in Traditional Chinese. English, Chinese and Japanese SHALL
cover localized navigation, starting, answering and leaving a game.

#### Scenario: Complete a game

- **WHEN** the acceptance suite runs against the production build
- **THEN** every mode/question-type combination in the representative locale reaches a correct result and starts a clean replay
- **AND** shorter journeys validate operation in all supported languages

### Requirement: Browser player-flow coverage

Acceptance SHALL verify desktop Chromium, Firefox, WebKit, and mobile WebKit emulation,
with real answer controls operable through browser actions. Required E2E checks
SHALL focus on player journeys rather than exact geometry. Reports SHALL
distinguish emulation from physical devices.

#### Scenario: Answer operation

- **WHEN** a game is shown in a supported test viewport
- **THEN** players can start the game, select an answer and receive feedback through the rendered controls

### Requirement: Release evidence

Release SHALL follow passing local and remote validation and record the deployed
revision and live verification. The report SHALL identify tests not executed.

#### Scenario: Pages publication

- **WHEN** the passing migration PR merges to main
- **THEN** the Pages workflow deploys and the published game's asset and gameplay checks pass
