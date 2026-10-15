# Verification

## Implementation

- Branch: `feat/multilingual-landing-page`, based on master `b62975f`.
- Step 1: `7e19d0b`, actual localized captures and reproducible screenshot script.
- Step 2: `5c30637`, responsive localized introduction and Home repository link.
- Step 3: `8e36c1d`, scroll correction and removal of the Home source link following user feedback.
- Step 4: browser coverage, preview documentation and archive handoff.

## Checks

- `pnpm lint`: passed, zero warnings.
- `pnpm typecheck`: passed.
- `pnpm test:unit`: 15 tests passed.
- Production build: passed; screenshots are emitted under the Pages base and precached by Workbox.
- Initial targeted production Chromium landing and existing layout suite: 9 passed.
- After the scroll correction, targeted development Chromium suite: 8 passed; the production-only offline case was skipped.
- Full production matrix: 141 passed; 3 mobile WebKit cases initially stopped at unsupported driver wheel input.
- After using PageDown for that driver, all 6 mobile WebKit landing cases passed. All 144 matrix cases are covered by these runs; application code was unchanged between runs.
- `openspec validate add-multilingual-landing-page --strict`: passed.

Landing tests cover all three languages at 320×568, 390×844, 844×390 and
1280×900; trailing-slash routes; language switching; unknown-language fallback;
play actions; restoring the game shell; Home's absent external link; localized
screenshot dimensions and offline reloads. Axe checks WCAG 2 A/AA and 2.1 AA.
Existing gameplay, keyboard, language geometry, resources and worker upgrade
checks remain part of the full suite.

## Visual review and limits

Reviewed actual Chromium mobile and desktop captures of the hero and
attack/defense examples. Preview artifacts and screenshot provenance are linked
from `docs/landing-page/README.md`. Image sources are unmodified real game captures.
The long introduction scrolls inside the safe-area shell; game routes remain fixed.

WebKit mobile is an iPhone 13 viewport simulation. Physical Safari chrome and
screen-reader behavior were not verified on a device. This branch is not deployed.

## Scroll correction

Reproduced a blocked wheel scroll in the running development server: both scroll
selectors had equal specificity and import order allowed `overflow: hidden` to win.
Moved the scroll modifier beside the shell rule and increased specificity to
`.app-content.app-content-scroll`. Tests now assert computed overflow and actual
wheel movement (PageDown for mobile WebKit, whose Playwright driver does not
implement wheel input), rather than relying on programmatic element scrolling. A Chromium
iPhone-sized touch swipe moved scrollTop from 0 to 761 on the development
server and from 0 to 592 on the production preview.
