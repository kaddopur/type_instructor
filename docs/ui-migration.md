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
- Home focuses Start; navigation pages focus their first action; results focus Retry,
  described by the result summary.
  Starting/advancing a question focuses the first available answer, described by the question heading.
- Answer outcome is available as text and a live announcement, independent of color.
- The timer is not announced every second.
- Automated accessibility checks and existing desktop/mobile browser coverage.
- Production asset paths, direct hash reloads, service-worker upgrades and offline play.

Automated checks and browser accessibility-tree checks do not replace human
screen-reader testing or establish full WCAG conformance. Timed game rules remain unchanged.

## Verification

- Node 24.19.0 / pnpm 11.22.0, frozen-lockfile installation.
- ESLint, strict TypeScript checks and 15 Vitest unit tests, including route validation.
- Production browser smoke subset: seven Chromium tests selected with `@smoke`.
- Complete E2E suite: 120 tests over Chromium, Firefox, desktop WebKit and mobile WebKit emulation.
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
GitHub Actions continues to build `dist`, test it, and deploy only merged main changes.
The branch's new UI is not claimed as published until its PR is merged and deployment succeeds.

## Test organization

Unit tests live beside their source (`src/**/*.test.ts`) and run under Vitest's
Node environment. Playwright collects only `tests/e2e/**/*.spec.js`; browser fixtures
and server helpers live under that directory. Existing browser tests remain JavaScript.

A single `playwright.config.js` defines all four browser/device projects. The full
`pnpm test:e2e` run includes all smoke, gameplay, accessibility and offline cases once
per project. `pnpm test:e2e:smoke` selects seven Chromium cases with `@smoke`;
`pnpm test:a11y` selects `@a11y` across the matrix. CI runs unit tests followed by one
complete E2E run, without a separate duplicate smoke run.

## Mobile Safari app shell

The shared AppShell owns the dynamic viewport height and safe-area padding.
Routes fit inside its content area without document or inner scrolling. Short
viewports use reduced spacing; landscape menus arrange the two modes side by side.
The viewport uses
`viewport-fit=cover`, with all four safe-area insets handled by the shell.
Quiz keeps its fixed-height layout inside the available shell space.

The @layout browser check covers home, menu, language, results and quiz in all
three languages, portrait and landscape, with simulated safe-area padding.
Browser emulation cannot reproduce iOS Safari's Liquid Glass address bar. Verify
expanded/collapsed bars and home-screen mode on an actual iPhone before claiming
this specific device issue is resolved.

## Traditional Chinese font

Chinese routes use a locally bundled Cubic 11 font for CJK characters and
punctuation, with the original PKMN/GB fonts retained for Latin, digits and kana.
The unmodified WOFF2 and upstream OFL license are stored under src/fonts; the
source revision is recorded there. Workbox precaches the font for offline use.
The existing Chinese UI contains 88 unique Han characters, all covered by Cubic 11.
The simplified character in 没有效果 was corrected to 沒有效果.

Font verification: lint, TypeScript and all 15 unit tests passed. The 44 targeted
browser checks (navigation/resources, layout, keyboard and axe) passed across all
four projects. Chinese font loading and fetching the font after an offline reload
are checked in the Pages resource test. Chromium's rendered-font inspection
confirmed Cubic 11 draws the Chinese menu heading; a 390×600 screenshot was inspected.

Japanese kanji also use Cubic 11 through the shared fallback stack; PKMN remains
first for kana and digits. Its CSS kana range includes U+30FC (ー), which was
previously excluded. The resource check visits both Chinese and Japanese menus.

Japanese fallback verification: lint/typecheck and 16 layout/navigation/resource
checks passed across the four browser projects. Rendered-font inspection in
Chromium confirmed Cubic 11 for 基本 and PKMN Strict for ホーム, including ー;
the 390×600 Japanese menu screenshot was inspected.

## Stable language selection

The language page uses a constant local text size and em-based dimensions, so
switching the global language font size does not move or resize its controls.
Compact viewport spacing uses the same local units. A regression check compares
all three buttons before/after English, Japanese and Chinese selection at three
viewport sizes across all four browser projects.

Japanese typography now prioritizes Cubic 11 for kana, kanji and punctuation,
including mixed labels such as やり直し and メニューに戻る. Latin and digits stay
on PKMN/GB. This supersedes the earlier choice to retain PKMN for Japanese kana,
so Japanese labels no longer mix the two fonts' glyph metrics.
Rendered-font inspection confirms both result actions (やり直し and メニューに戻る)
use only Cubic 11. The updated result screenshot was inspected; lint and all 20
layout/navigation/resource checks passed across four browser projects.

Menu typography and spacing now use fixed local dimensions across languages:
20px action/footer text, 24px headings, 175px action widths and 24px corners.
The existing layout check compares all four menu actions' positions and sizes
across en/zh/ja; lint, typecheck and 20 layout/navigation checks passed.
The updated English menu screenshot at 390×844 was inspected.

## Layout does not depend on the selected language

The root font size is now a single CSS value (125%, normally 20px) for every
language. Language navigation changes translations, document
language and title, but no longer resizes rem-based layout dimensions.
The quiz intro description reserves two lines; feedback occupies the full stem
width. Result actions share a 240px width so Japanese labels stay on one line.
This replaces the earlier baseline rule that enlarged only Chinese and Japanese.

A dedicated geometry regression check covers home, menu, language, both result
modes, and all four quiz modes in intro/playing/answered states. It compares
control/container positions, sizes, radii and font sizes across en/zh/ja at
390×600, 844×390 and 1280×900 in all four browser projects. Natural footer text
width may differ; its center, vertical position and line height must remain stable.
Real iOS Safari browser chrome and physical devices are still not emulated.

All three languages now use Cubic 11 for Latin, digits and CJK glyphs, replacing
the earlier Unicode restriction that sent Latin text to the full-width GB font.
Equivalent UI roles retain the same font sizes and line heights across locales;
the home title is larger than action text, and HUD/record text uses 14px.

Final locale-layout audit: lint, typecheck, 15 unit tests and all 120 E2E cases
passed locally. The complete suite includes all four browser/device projects.
