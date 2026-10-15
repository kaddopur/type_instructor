# Replace Redux with Zustand

## Why

The user selected Zustand for migration step 3. The application needs a small
game-session store; language dictionaries and URL parameters do not need a store.

## What Changes

- Replace Redux actions/reducer/connect/Provider with Zustand session stores.
- Keep only game state in Zustand; supply static translations from the language URL.
- Replace class-based game orchestration with a hook that cleans up interval and
  feedback timers when a session ends, changes route, or unmounts.
- Preserve existing UI, URL formats, scoring, and the known step-4 speedrun defects.
- Adapt baseline tests to production Zustand actions and extend lifecycle checks.

## Capabilities

### New Capabilities

- `game-session-state`: Isolated Zustand sessions and guarded game actions.

### Modified Capabilities

None. The behavior baseline remains the reference; session ownership changes.

## Impact

Remove redux and react-redux dependencies and src/ducks. Update game rendering,
localization wiring, tests, lockfile, and documentation. No persistence middleware
or new gameplay features are introduced.
