# mobile-interface-layout Specification

## Purpose
Define safe mobile viewport ownership, bundled CJK typography and stable control geometry across supported languages.

## Requirements
### Requirement: Shared safe viewport
The application SHALL use a shared shell to contain routes inside the dynamic
viewport and device safe-area insets. Supported mobile layouts SHALL fit without
document or inner page scrolling, including compact landscape navigation.

#### Scenario: Compact navigation
- **WHEN** a player opens Home, Menu, language selection or results in a supported compact viewport
- **THEN** the controls remain within the shell's usable area without scrolling

#### Scenario: Quiz viewport
- **WHEN** a quiz starts inside the safe-area shell
- **THEN** all four answer controls remain inside its usable viewport

### Requirement: Local CJK pixel typography
The application SHALL bundle Cubic 11 and its license locally as the primary UI
font for English, Chinese and Japanese, including Latin letters, digits, kana,
kanji and punctuation. PKMN/GB SHALL be fallbacks for missing glyphs. Equivalent
UI roles SHALL retain the same font sizes and line heights across languages.

#### Scenario: Japanese mixed label
- **WHEN** the player sees やり直し or メニューに戻る
- **THEN** kana and kanji use Cubic 11 with consistent glyph metrics

#### Scenario: Offline font delivery
- **WHEN** the production application reloads offline after worker activation
- **THEN** the bundled CJK font remains available under the Pages base path

#### Scenario: Consistent Latin typography
- **WHEN** the player switches between English, Chinese and Japanese
- **THEN** Latin text and digits retain consistent rendered glyph metrics without language-specific font scaling

### Requirement: Stable action geometry
Home, Menu, language selection, result and quiz intro controls SHALL preserve
size, position and corner radius across en, zh and ja at the same viewport.
Dialog menu labels SHALL remain on one line, and intro actions SHALL be equally wide.

#### Scenario: Language switch
- **WHEN** the selected language changes at the same viewport size
- **THEN** translated text changes without resizing or repositioning controls

#### Scenario: Intro and feedback
- **WHEN** translated quiz instructions or answer feedback are displayed
- **THEN** reserved container space prevents language-dependent layout changes

