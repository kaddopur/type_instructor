# Design

## Interface

Tailwind supplies static type-color utilities and pixel-themed layout styles.
Shared Button and Dialog components use shadcn conventions and Radix primitives;
the vendored component license is retained. Native buttons and links expose
keyboard semantics. The controlled start dialog traps focus and starts the timer
only after explicit confirmation; dismissal returns to the menu.

Route navigation focuses the first available action. Each new quiz question
focuses its first available answer, whose description includes the question.
Results connect Retry to the result summary. Localized polite status feedback
announces answer outcomes without announcing timer ticks. Contrast checks cover
all type colors and incorrect-answer styling.

## Test boundaries

Vitest runs only src/**/*.test.ts in Node and shares Vite configuration. Four
colocated suites cover quiz generation, status, routes, and the Zustand store.
Browser specs, fixtures, and support servers live under tests/e2e. They use one
Playwright configuration and tags @smoke, @gameplay, @a11y, and @offline.

The default browser server builds and previews the Pages artifact. E2E_SERVER=dev
selects Vite development mode for a local smoke run. All projects use the Pages
base path; the mobile project is WebKit device emulation, not physical-device proof.
CI runs unit tests and one full browser suite before the existing Pages flow.

## Limits

Automated axe and keyboard checks do not establish complete accessibility
conformance or replace assistive-technology testing. This branch has not been
pushed or deployed; the existing release-evidence gate applies before publication.
