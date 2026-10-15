# game-landing-page Specification

## Purpose

Define a responsive English, Traditional Chinese and Japanese game introduction
with accurate rules, actual screenshots, accessible navigation and scoped scrolling.

## Requirements

### Requirement: Localized game introduction

The application SHALL provide /:lang/about in en, zh and ja, reachable from Home.
It SHALL explain single-type matchups, the two modes, attack/defense choices,
+1/-1 scoring, the 60-second basic game and the 20-point speedrun. Language
switches SHALL preserve the landing route, and play actions SHALL retain locale.

#### Scenario: Read and start

- **WHEN** a player reads the introduction in a supported language and starts
- **THEN** the game menu opens in the same language

### Requirement: Real localized screenshots

The page SHALL show local, unmodified browser captures of the actual game in
the selected language, with meaningful localized alternative text. Capture
provenance and a repeatable generation command SHALL be documented.

#### Scenario: Offline images

- **WHEN** the production page reloads offline after initial precaching
- **THEN** its screenshots and introduction remain available under the Pages base

### Requirement: Responsive scoped scrolling

The introduction SHALL fit mobile and desktop widths without horizontal overflow
and allow its long content to scroll inside the safe-area shell. Existing game
pages SHALL retain their fixed no-scroll layout. Keyboard and semantic heading
navigation SHALL work throughout the page.

#### Scenario: Return to game

- **WHEN** the player leaves the introduction for Home or a game page
- **THEN** the shell restores its normal no-scroll layout

### Requirement: Home without an external author link

Home SHALL omit its previous author or GitHub link. The introduction footer SHALL
retain a source link to https://github.com/kaddopur/type_instructor.

#### Scenario: Open source link from the introduction

- **WHEN** a player activates the introduction's source link
- **THEN** the repository opens safely in a new tab

### Requirement: Independent project identity

Home and the introduction SHALL use Type Instructor as the primary name, with a
localized subtitle identifying Pokémon type-matchup practice. Both SHALL visibly
state that this is an unofficial fan project without affiliation, authorization
or sponsorship. Browser titles and the installed app name SHALL use Type Instructor
as the project identity. Language controls SHALL be ordered English, Chinese, Japanese.

#### Scenario: Identify the project

- **WHEN** a player opens Home or the introduction in any supported language
- **THEN** the primary name, descriptive subtitle and localized unofficial notice are visible
- **AND** Home controls remain inside the usable viewport without scrolling

### Requirement: Localized PWA installation guidance

The introduction SHALL explain how to install the web app using Safari on
an iPhone or iPad, Chrome on Android, and Chrome or Edge on a computer in all
three languages. It SHALL provide numbered steps, official help links and
instructions for opening links outside an in-app browser. It SHALL distinguish
installation from completed offline caching and retain browser play as a fallback.

#### Scenario: Install from the introduction

- **WHEN** a player reads the installation section in a supported language
- **THEN** platform-specific instructions and offline prerequisites are available
- **AND** the instructions fit mobile and desktop widths without horizontal overflow
