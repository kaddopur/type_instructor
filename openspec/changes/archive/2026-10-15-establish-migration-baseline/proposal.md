# Establish migration baseline

## Why

Before migrating the 2016 React application, capture its existing behavior and
verification boundaries so tooling changes can be checked for regressions.

## What Changes

- Initialize OpenSpec and document gameplay, navigation, and language baselines.
- Record the incorrect speedrun defense link and the 3/20-point goal mismatch as
  future fixes, rather than preserving them as correct behavior.
- Add Node-based tests for the existing question generator, scoring reducer, and
  damage feedback, with execution instructions and pending browser checks.

## Capabilities

### New Capabilities

- `gameplay`: Existing single-type questions, scoring, feedback, and game modes.
- `navigation-and-language`: Existing hash routes and three-language navigation.

### Modified Capabilities

None. The baseline specs were written directly to `openspec/specs` before this
completion record was created. Archive with `--skip-specs` to retain those specs.

## Impact

Documentation, tests, and one package script only. Runtime source and dependency
versions are unchanged. React/browser behavior and production builds remain
pending verification during the subsequent migration steps.
