# Stabilize mobile and localized interfaces

## Record status

This retrospective record covers the user-requested work on
fix/mobile-safari-app-shell after PR #4. Implementation preceded this record;
it does not claim an earlier proposal approval. Remote CI and deployment are
not part of the completed local verification.

## Why

Safari browser controls could obscure navigation pages. Missing CJK fonts and
language-dependent root font sizing also caused inconsistent typography, button
sizes, corners and positions when changing languages.

## What Changes

- Add a shared safe-area application shell and compact viewport layouts.
- Bundle licensed Cubic 11 for Chinese and Japanese, retain PKMN/GB for Latin
  and digits, correct 没有效果 to 沒有效果, and remove unused font files.
- Stabilize Home, Menu, language selection, result and dialog actions.
- Use one root font size for every language; reserve description/feedback space.
- Add cross-language geometry, font-loading and offline resource checks.

## Capabilities

### New Capabilities

- mobile-interface-layout: Shared viewport ownership and localized font delivery.

### Modified Capabilities

- navigation-and-language: Changing language must preserve layout geometry.

## Impact

Shared shell, CSS, page components, fonts/license, language strings, browser
checks, specifications and documentation. Existing game rules, hash routes and
Pages base remain supported.
