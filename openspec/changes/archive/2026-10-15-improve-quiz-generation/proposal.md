# Improve quiz generation

## Why
Independent random targets leave gaps in short sessions. The unused lastEnemy
argument does not prevent consecutive repeats. Defense always selects the global
minimum, so immunity hides useful resistance matchups.

## What Changes
- Deal each session's targets from shuffled bags of all 18 types, with no repeat
  across bag boundaries.
- Alternate immunity and resistance for each defense target across successive
  rounds; exclude immune options in resistance questions.
- Preserve four distinct options, one best answer, scoring, timers and languages.
- Add generator/store regression tests and adapt browser tests to varying targets.

## Capabilities
### Modified Capabilities
- gameplay: Balanced target coverage and defense practice.

## Impact
Quiz generation, session store, unit/browser tests and gameplay documentation.
No dependencies, persistence, UI settings or changes to the damage matrix.
Distractor difficulty tiers and delayed mistake review are deferred.
