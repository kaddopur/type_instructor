# Clarify quiz conditions and questions

## Why

The user approved the attack/defense comparison mockup. The previous stem could
leave the poison type ambiguous: enemy type or selected attack. Separate the
known enemy condition from an explicit question in every supported language.
This is an additional change after the eight UI-refresh commits in PR #6.

## What Changes

- Attack: identify the enemy type, then ask for the most effective attack type.
- Defense: identify the enemy attack type, then ask which own type takes least damage.
- Remove parentheses from the given type name and place the instruction below the card.
- Associate both condition and question with keyboard answer context.
- Preserve locale layout geometry, 2×2 controls and all gameplay rules.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- refreshed-interface: Explicit, separate condition and instruction for each quiz kind.

## Impact

Quiz markup/CSS, en/zh/ja strings, browser assertions and screenshot documentation.
No changes to damage matrix, correct-answer selection, timers or scoring.
