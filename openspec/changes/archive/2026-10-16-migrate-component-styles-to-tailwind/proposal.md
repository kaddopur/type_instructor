# Complete the Tailwind component-style migration

## Why
Page layouts and shared controls still depend on two component stylesheets.
Their repeated selectors and unlayered overrides make Tailwind classes harder
to reason about and risk changing the validated multilingual interface.

## What Changes
- Move all component layout, typography, responsive, state and pseudo-element
  styles into Tailwind utilities on the owning React components.
- Keep only framework imports, theme tokens, font faces, shared responsive
  variants and genuine document-wide base rules in index.css.
- Remove Landing.css and consolidate repeated page layout classes.
- Preserve current pixel dimensions, breakpoints, appearance, focus behavior,
  gameplay, screenshots, supported languages and offline delivery.
- Compare computed styles and element geometry against the current build,
  then run the existing browser and unit checks.

## Capabilities
### Modified Capabilities
- refreshed-interface: Complete component-style ownership in Tailwind.

## Impact
AppShell, Home, Menu, Lang, Quiz, Result, Landing and shared Dialog styles.
No dependency, translation, game-rule, route or storage changes.
