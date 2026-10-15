# Fix speedrun rules

## Why

BUG-01 sends the speedrun defense menu entry to attack mode. BUG-02 ends speedrun
at 3 points while every language describes a 20-point goal.

## What Changes

- Route the speedrun defense entry to speedrun/defend.
- Set one shared speedrun target to 20, used by the store and localized instructions.
- Replace numeric translation literals with a scoreTarget placeholder.
- Verify both speedrun menu entries in all languages and the 19/20-point boundary.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `gameplay`: Speedrun ends at 20 points and its instructions use the shared goal.
- `navigation-and-language`: Both speedrun menu entries select the correct question type.

## Impact

One rules constant, game instructions, three translation values, one menu URL,
regression tests, and documentation. No dependencies or offline tooling changes.
