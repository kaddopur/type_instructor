# Return Home after choosing a language

## Why
Choosing a language currently leaves the player on the language page and requires
another action to return Home. The user approved returning Home immediately,
including when selecting the current language, while preserving the introduction
page during its own language switches.

## What Changes
- Point language-picker choices at the selected language's Home route.
- Retain the shared route behavior that focuses Start on arrival.
- Update navigation, gameplay and picker geometry checks for the shorter flow.

## Capabilities
### Modified Capabilities
- navigation-and-language: Home destination and Start focus after selection.

## Impact
One route target in Lang, current navigation requirements and browser checks.
No styling, dependencies, game rules or introduction-page navigation changes.
