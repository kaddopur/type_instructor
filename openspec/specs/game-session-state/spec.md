# game-session-state Specification

## Purpose
TBD - created by archiving change replace-redux-with-zustand. Update Purpose after archive.
## Requirements
### Requirement: Zustand ownership
The application SHALL manage game state with Zustand and contain no Redux runtime,
React Redux bindings, Provider, action dispatch infrastructure, or reducer dependency.
Language dictionaries SHALL be static data selected by URL language.

#### Scenario: Game interaction
- **WHEN** a player starts a game and selects an option
- **THEN** Zustand actions update timer, score, and feedback using the gameplay baseline

### Requirement: Isolated sessions
Each mounted game session SHALL start with its own fresh state. Replaying or
changing game routes SHALL reset the game without leaking state from another session.

#### Scenario: Change modes during feedback
- **WHEN** a player navigates to another game while feedback is pending
- **THEN** the new game shows its start overlay, zero score, and its mode's initial timer

### Requirement: Guarded actions
Game actions SHALL reject answers before start, during feedback, after completion,
for invalid options, and for options already selected on the current question.

#### Scenario: Rapid repeated answer
- **WHEN** the same option is selected repeatedly before feedback completes
- **THEN** only the first valid answer changes the score

### Requirement: Timer lifecycle
The game hook SHALL start one interval after the overlay is dismissed and clear
both interval and feedback timeout on completion or unmount, including StrictMode.

#### Scenario: Leave during feedback
- **WHEN** the player leaves a game before its feedback timeout completes
- **THEN** no delayed update or result navigation affects the next page or session

