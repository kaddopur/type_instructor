## ADDED Requirements

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
