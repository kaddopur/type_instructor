# Tailwind, shadcn and accessibility migration

Keep the pixel fonts, Pokémon type palette, three languages, hash URLs,
60-second basic games and 20-point speedruns. The production output must remain
static and work under the GitHub Pages `/type_instructor/` base, including offline play.

## Commits

1. Configure Tailwind's Vite plugin, import aliases and shadcn metadata.
2. Add shared pixel tokens and adapted shadcn Button/Dialog components.
3. Convert home, menu, language and result pages to Tailwind.
4. Convert the quiz, use native answer buttons and the start dialog.
5. Add keyboard/focus flows, translated announcements and contrast improvements.
6. Add accessibility checks, update browser tests and verify production/offline builds.

Tailwind Preflight is deferred until the page styles are migrated, so intermediate
commits retain the legacy reset. New controls use explicit styles throughout.

## Acceptance

- Keyboard-only start, answer, feedback, next question, result and retry.
- Dialog has a title/description and contains focus; dismissal returns to the menu.
- Focus stays usable across questions and moves to the result heading on navigation.
- Answer outcome is available as text and a live announcement, independent of color.
- The timer is not announced every second.
- Automated accessibility checks and existing desktop/mobile browser coverage.
- Production asset paths, direct hash reloads, service-worker upgrades and offline play.

Automated checks and browser accessibility-tree checks do not replace human
screen-reader testing or establish full WCAG conformance. Timed game rules remain unchanged.
