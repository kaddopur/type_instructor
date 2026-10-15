# Design

Use the existing Tailwind 4 Vite integration and shadcn/Radix controls. Retain
semantic class names as browser-test hooks without defining component selectors
in CSS. Share only the repeated page layout/title/footer utility strings.

Preserve explicit pixel values because the root font size is 125%, making
Tailwind's default rem spacing differ from the original pixel dimensions.
Consolidate the final computed values of repeated CSS selectors rather than
copying contradictory declarations. Define shared compact-height, short-height,
compact-landscape and Landing-mobile variants with their original media queries.

Keep global typography, theme/font declarations and document-wide focus rules
in index.css. Move progress-bar browser pseudo-elements and decorative elements
to arbitrary Tailwind selectors. Remove the standalone Landing stylesheet.

Capture pre-migration computed styles and geometry for all routes, languages,
viewport classes and Quiz states. Compare after migration and inspect actual
screenshots. Existing layout, typography, gameplay, accessibility and offline
checks remain the regression boundary; no visual redesign is intended.
