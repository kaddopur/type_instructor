# Verification

## Final checks
- `pnpm lint` and `pnpm typecheck`: passed.
- `pnpm test:unit`: all 27 tests in seven files passed.
- `CI=1 pnpm test:e2e`: all 212 tests passed with two workers (3.3 minutes).
  Projects: Chromium desktop, Firefox desktop, WebKit desktop and iPhone-size
  WebKit emulation. Production Vite and Workbox generation ran as part of testing.
- Strict OpenSpec validation passed for the change and current specs before
  archival. Specs were synchronized before archival, so `--skip-specs` avoids
  reapplying the integrated modified requirement.
- Strict validation after archival: all 13 current specs and all 17 archived changes passed.
- `git diff --check` passed.

## Pre/post migration comparison
A temporary browser harness captured 264 states of the previous main build and
migrated build. It covered English, Chinese and Japanese; 320 x 568, 390 x 600,
844 x 390 and 1280 x 900; Home, Menu, Lang, About, both result modes, all four
Quiz modes and Quiz intro/playing/feedback/exit states.

For every DOM element in the application and dialogs, the harness recorded
bounding rectangles, fonts, text sizes, line heights, colors, border dimensions,
radii, alignment, overflow, outlines and box shadows, including before-elements.
The resulting JSON records matched with zero differences. Both SHA-256 values:
`a3c59fba5fe95e04e66dae67e8d77afcb09e10b1d44d0f8b245fe6292c96f27c`.
The temporary harness and raw data remain outside the repository. Actual Home,
Menu, About, Quiz and exit-dialog screenshots were visually inspected.

The first comparison found inherited line-height drift in three About headings;
explicit line-height utilities resolved it. A direct shadow property utility
preserves the original decorative shadow serialization as well as appearance.
Existing real game PNGs remain accurate because their rendered layouts match.

## Scope and limitations
Landing.css is removed. index.css falls from 790 lines to 104, retaining only
Tailwind imports, theme variables, font faces, document-wide base rules and
shared responsive variants. No component selectors or @apply blocks remain.
The shared pageStyles module contains only repeated page/title/footer utilities.
No dependency, route, translation, storage or gameplay changes are included.
Browser downloads are local test tooling and do not change application packages.
Physical devices, installed iOS mode and manual screen readers were not tested.
Remote CI, merge and deployment are separate from these local results.

The user requested deferring PR creation. This handoff stops after commit and push.

## Canonical utility follow-up
The spacing theme now declares `--spacing: 4px`, independent of the 125% root
font. Pixel spacing/dimension utilities use canonical numeric classes such as
`mt-8`; existing rem-based button spacing was adjusted to preserve its geometry.
Pixel typography and radii remain explicit when default theme values differ.
The same 264-state comparison again reports zero differences. Lint, typecheck,
all 27 unit tests and seven Chromium smoke tests passed after this cleanup.
The full four-browser suite was not repeated for this follow-up.
