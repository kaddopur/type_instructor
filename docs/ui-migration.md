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

Tailwind Preflight was deferred until step 4, when all page styles had been migrated.
The final build uses Preflight and removes normalize.css and the legacy page styles.

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

## Verification

- Node 24.19.0 / pnpm 11.22.0, frozen-lockfile installation.
- ESLint, strict TypeScript checks and 12 native game-logic tests.
- Production smoke suite: 15 tests, including the seven accessibility cases.
- Acceptance suite: 80 tests over Chromium, Firefox, desktop WebKit and mobile WebKit emulation.
- Accessibility scans cover all three languages, home/menu/language/results, every mode's
  intro dialog and playable/answered states. No axe rules are disabled.
- Computed text/background colors are checked for all 18 target types, rendered options
  and the wrong-answer color, with a 4.5:1 minimum contrast ratio.
- Navigation links explicitly use tabindex=0 for WebKit keyboard navigation; keyboard tests
  use forward/backward traversal instead of assuming browser-chrome focus wraps.
- Automated keyboard flows exercise Tab/Shift+Tab, Escape, Enter and Space, focus containment,
  answer locks, both completion modes, route focus and retry.
- Existing Pages-base asset checks and real old/new worker update/offline tests remain in use.
- Phone-size screenshots of the home screen, start dialog and quiz were visually inspected.

There is no SSR or server runtime. The Vite base and hash routes are unchanged;
GitHub Actions continues to build `dist`, test it, and deploy only merged master changes.
The branch's new UI is not claimed as published until its PR is merged and deployment succeeds.
