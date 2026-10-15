## ADDED Requirements

### Requirement: Tailwind component styling
New or changed component layout, spacing and typography SHALL use Tailwind CSS
utilities with the shared shadcn/Radix controls and theme tokens. Shared theme
definitions, font faces and existing shared stylesheet rules MAY remain in CSS.

#### Scenario: UI changes
- **WHEN** a control, record label or responsive component layout is added or changed
- **THEN** its styles use Tailwind utilities without adding competing component-specific CSS rules
