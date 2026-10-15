# accessible-interface Specification

## Purpose
Define keyboard focus, dialog behavior, localized feedback, and control contrast for the game interface.

## Requirements
### Requirement: First available action receives focus

The interface SHALL focus the first available action after route navigation.
When a new quiz question becomes answerable, keyboard input SHALL focus the first
available answer; pointer or touch input SHALL focus the answer group so the next
Tab enters its first answer. Question and result context SHALL be programmatically
associated with the answer group, focused answer or retry control.

#### Scenario: Home navigation
- **WHEN** the home route is displayed
- **THEN** the Start action receives keyboard focus

#### Scenario: Next question
- **WHEN** keyboard answer feedback ends and the next question becomes answerable
- **THEN** the first available answer receives focus and exposes the question as its description

#### Scenario: Next question after pointer input
- **WHEN** mouse or touch answer feedback ends and the next question becomes answerable
- **THEN** focus moves to the answer group and the first Tab focuses the first answer with a visible focus indicator

### Requirement: Accessible start dialog

The quiz SHALL use a named modal dialog with a description and contained keyboard
focus. The game SHALL start only after explicit confirmation.

#### Scenario: Confirm start
- **WHEN** the player activates the dialog start action
- **THEN** the dialog closes and focus enters the answers according to the input method

#### Scenario: Dismiss start
- **WHEN** the player dismisses the start dialog
- **THEN** navigation returns to the menu without starting the game timer

### Requirement: Accessible answer feedback

Answers SHALL use native keyboard-operable controls. Feedback SHALL be localized
and exposed through a polite status region. Timer ticks SHALL NOT be live announcements.
Text on type-colored controls SHALL meet a contrast ratio of at least 4.5:1.

#### Scenario: Answer submitted
- **WHEN** a player submits an answer
- **THEN** localized correctness feedback is visible and available through the status region
- **AND** unavailable answers cannot change the game state

