# Design

## Context
The application uses Tailwind CSS 4, shared shadcn/Radix Button and Dialog,
Zustand game sessions, hash routes and a safe viewport shell. Current specs
previously required PKMN/GB Latin glyphs and always focusing the first answer.
The user approved the changed typography and input-method-aware focus flow.

## Decisions
- Keep time, exit and score in one row. Exit opens a modal focused on continuing;
  dismissing restores the trigger. The timer and existing result transition
  continue during confirmation, and answers are blocked behind the dialog.
- Track keyboard versus pointer input in a ref. For a fresh question, keyboard
  input focuses the first answer; pointer/touch focuses a non-tab-stop answer
  group, so the next Tab enters its first child. Existing feedback behavior stays.
- Persist best values only from the completed Quiz result transition, before
  navigation. Result URLs are display-only and cannot create records. Separate
  localStorage keys represent mode and question kind; languages share keys.
  Basic uses maximum scores, including negative initial values; speedrun uses
  minimum nonnegative integer times, including zero. Storage errors are optional
  persistence failures and cannot interrupt play.
- Use the already bundled Cubic 11 for all supported scripts and digits instead
  of full-width GB Latin glyphs. Keep role-based sizes constant across locales.
- Put changed component layout, spacing and typography in Tailwind utilities.
  Retain font faces, theme tokens and existing shared CSS. No new dependencies.
- Capture actual built pages at 390 x 844 with fixed randomness and clock. Wait
  for fonts and paint, and click neutral headings before capture so navigation
  focus rings do not obscure the screenshots. Preserve provenance for uncommitted
  source changes and permit the installed Chrome channel.

## Limits
Records belong to this browser and are not synchronized. Clearing storage clears
records; storage-denied environments still work without persistence. Automated
Chrome and touch emulation do not replace physical iOS or screen-reader checks.
