## MODIFIED Requirements

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
