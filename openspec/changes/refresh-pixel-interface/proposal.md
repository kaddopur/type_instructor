# Refresh the pixel interface

## Why

The user selected the first UI concept and requested eight implementation steps,
with one commit per step. Retain pixel typography, yellow/blue accents and type
colors while making navigation, hierarchy and feedback consistent across locales.

## What Changes

1. Shared colors, typography and primary/secondary controls.
2. Home title, local pixel decorations and grouped actions.
3. Mode cards with descriptions and paired attack/defense controls.
4. Language selection with a check and pale-yellow selected state.
5. Compact start dialog with a mode label and equal-width actions.
6. Quiz hierarchy, fixed feedback, answer symbols and 20-point progress.
7. Result emphasis and clear retry/navigation hierarchy.
8. Browser/layout/accessibility/offline verification, documentation and archive.

## Capabilities

### New Capabilities
- refreshed-interface: Cohesive pixel interface and mode-specific progress.

### Modified Capabilities
None. Existing gameplay, safe-area and locale-layout guarantees remain in force.

## Impact

Page components, shared controls, CSS tokens, three translation files and browser
checks. No new runtime dependencies or game-rule changes. Publication evidence
must be recorded separately from local results.
