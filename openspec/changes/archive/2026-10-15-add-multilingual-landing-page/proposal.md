# Add a multilingual game landing page

## Why

The user requested a new branch with a responsive landing page introducing the
game and its rules in English, Traditional Chinese and Japanese, using real
game screenshots. The user later requested removing the repository link from Home.

## What Changes

- Add /:lang/about and a localized Home entry, preserving game routes.
- Introduce the game, modes, attack/defense questions, scoring and keyboard controls.
- Capture the actual built game in each language and bundle those screenshots locally.
- Scope scrolling to the long-form landing page; preserve the game shell's fixed layout.
- Remove Home's author link as requested; retain the source link on the introduction.

## Capabilities

### New Capabilities
- game-landing-page: Responsive three-language introduction, instructions and real screenshots.

### Modified Capabilities
None; existing gameplay/navigation guarantees remain in force.

## Impact

A route/component, localized copy, local screenshot assets/capture script, scoped
layout, Home link and browser checks. No new runtime packages or gameplay changes.
