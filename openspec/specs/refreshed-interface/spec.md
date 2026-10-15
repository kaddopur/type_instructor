# refreshed-interface Specification

## Purpose

Define the approved pixel UI hierarchy, localized navigation, progress feedback and matching app icons.

## Requirements

### Requirement: Tailwind component styling

All component layout, spacing, typography, responsive, state and pseudo-element
styles SHALL use Tailwind CSS utilities with shared shadcn/Radix controls and
theme tokens. CSS SHALL be limited to Tailwind imports, theme variables, font
faces, shared responsive variants and document-wide base rules. Semantic class
names MAY remain as test hooks without component-specific CSS declarations.

#### Scenario: UI changes

- **WHEN** a page or shared control renders
- **THEN** its component styles come from Tailwind utilities, and no standalone Landing stylesheet or component-selector CSS rules are required

#### Scenario: Equivalent rendered behavior

- **WHEN** the migration is compared with the approved interface
- **THEN** pixel dimensions, locale geometry, responsive behavior, keyboard focus and gameplay remain unchanged

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

### Requirement: Explicit quiz condition and question

Every quiz SHALL separate the given enemy condition from the question the
player answers. Attack SHALL identify the enemy type and ask for the most
effective attack type. Defense SHALL identify the enemy attack type and ask
for the player's own type taking the least damage. The type name SHALL appear
without ambiguous parentheses. Both contexts SHALL be associated with answer
controls for keyboard and assistive-technology users in en, zh and ja.

#### Scenario: Attack question

- **WHEN** an attack quiz gives poison as the enemy type
- **THEN** the card labels poison as the enemy type and a separate question asks for the most effective attack type

#### Scenario: Defense question

- **WHEN** a defense quiz gives poison as the enemy attack type
- **THEN** the card labels poison as the enemy attack type and a separate question asks for the own type minimizing damage

#### Scenario: Stable localized slots

- **WHEN** players switch between the supported languages at the same viewport
- **THEN** the condition card, question slot and answer controls retain their positions and sizes
