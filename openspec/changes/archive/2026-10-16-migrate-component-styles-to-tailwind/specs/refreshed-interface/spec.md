## MODIFIED Requirements

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
