## ADDED Requirements

### Requirement: Balanced session target coverage
The system SHALL deal targets from session-local shuffled bags containing each
of the 18 types exactly once. Consecutive questions SHALL have different targets,
including across bag boundaries. Only generating a new question consumes a target.

#### Scenario: Complete rounds
- **WHEN** 36 questions are generated in one session
- **THEN** each consecutive block of 18 contains every type once and no adjacent targets match

#### Scenario: Retry and session isolation
- **WHEN** an answer is wrong or a separate session advances
- **THEN** the current session's pending target order is not consumed

#### Scenario: New game
- **WHEN** the player starts a new session
- **THEN** it owns a fresh bag and defense preference history

### Requirement: Defense immunity and resistance practice
The system SHALL alternate immunity and resistance preference independently for
each defense target, starting with immunity. A missing category SHALL fall back
to the available category. Every question SHALL retain four distinct options and
exactly one best answer among the displayed options.

#### Scenario: Target supports immunity and resistance
- **WHEN** the same defense target appears in successive rounds
- **THEN** its first answer has multiplier 0, its second answer has multiplier 0.5 with no immune options, and its third answer has multiplier 0 again

#### Scenario: No immunity
- **WHEN** the target has resistance but no immunity
- **THEN** its answer has multiplier 0.5 in either preference

#### Scenario: Normal attack resistance
- **WHEN** a normal attack target appears with resistance preference
- **THEN** its answer is rock or steel with multiplier 0.5 and ghost is excluded from the options
