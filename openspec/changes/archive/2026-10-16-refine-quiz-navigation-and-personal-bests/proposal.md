# Refine quiz navigation, personal bests and multilingual typography

## Why
Players cannot leave a running quiz through the interface, pointer users skip
the first answer when pressing Tab after a question change, and the menu does
not show completed personal bests. Full-width English glyphs also make localized
text appear inconsistent and overflow compact dialogs. Landing screenshots need
to reflect the resulting interface.

## What Changes
- Add a centered exit action between time and score, with localized confirmation.
- Separate pointer/touch and keyboard question focus behavior.
- Store completed personal bests per mode and attack/defense in this browser.
- Use Cubic 11 for Latin, digits and CJK at consistent locale-independent sizes;
  enlarge the Home title and keep narrow exit dialogs readable.
- Style changed controls and layout with Tailwind and shared shadcn/Radix controls.
- Refresh all nine localized game screenshots and record dirty-worktree provenance.

## Capabilities
### Modified Capabilities
- accessible-interface: Input-method-aware answer focus.
- mobile-interface-layout: Shared multilingual pixel font metrics.
- navigation-and-language: Confirmed exit and local personal bests.
- refreshed-interface: Tailwind component styling.

## Impact
Home, Menu, Quiz, translations, bundled font selection, screenshot generation,
OpenSpec, documentation and browser/unit coverage. No gameplay rules, dependency
versions, backend, publishing configuration or analytics changes.
