# refreshed-interface Specification

## Purpose
Define the approved pixel UI hierarchy, localized navigation, progress feedback and matching app icons.

## Requirements
### Requirement: Consistent pixel navigation
The interface SHALL use shared warm-canvas, white-surface, charcoal-outline and
yellow-primary tokens. Home SHALL group start/language actions; Menu SHALL show
two described mode cards with paired attack/defense actions. Language selection
SHALL distinguish the current language from keyboard focus with a visible check.

#### Scenario: Localized navigation
- **WHEN** players navigate or change between en, zh and ja
- **THEN** controls keep consistent sizes, corner radii and positions at the same viewport

### Requirement: Clear game hierarchy
The intro dialog SHALL show the selected mode and goal with equal-width primary
and secondary actions. Quiz SHALL reserve feedback space and retain four
colored answer controls. Results SHALL emphasize the score or elapsed seconds.

#### Scenario: Score progress
- **WHEN** a speedrun is active
- **THEN** progress targets 20 score points, preserves the actual score and never changes the game state

#### Scenario: Feedback and replay
- **WHEN** an answer is submitted and the game completes
- **THEN** localized text and symbols accompany feedback and Retry remains the first result action

### Requirement: Responsive accessible delivery
The redesign SHALL preserve the safe-area shell, keyboard flows, contrast,
Pages base and offline use. Automated checks SHALL cover all locales and browser
projects; physical-device limits SHALL be stated explicitly.

#### Scenario: Browser acceptance
- **WHEN** the production build is validated
- **THEN** complete games, layout invariance, accessibility and offline checks pass

### Requirement: Matching app icons
Browser favicon, Apple touch icon and PWA manifest icons SHALL use the local
pixel-T artwork with yellow, charcoal and blue. SVG/ICO/PNG delivery SHALL work
under the Pages base and be included in offline precaching.

#### Scenario: Icon delivery
- **WHEN** the application loads browser and manifest icons
- **THEN** all referenced assets resolve and raster dimensions match their declarations

