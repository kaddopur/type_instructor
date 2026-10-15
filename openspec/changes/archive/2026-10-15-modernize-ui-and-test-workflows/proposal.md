# Modernize the interface and test workflows

## Record status

This is a retrospective record of implementation already requested and completed
on `feat/tailwind-shadcn-a11y`, covering commits `8f22d2b` through `526cd42`.
It was written after local verification; it does not represent a proposal approved
before implementation. Publication and remote CI are outside this archive.

## Why

The existing game needed reusable accessible controls, consistent keyboard focus,
and a clear separation between fast unit tests and browser acceptance tests.

## What Changes

- Migrate page styling to Tailwind and pixel-themed shadcn/Radix controls.
- Add accessible start dialogs, localized feedback, and first-action focus.
- Migrate logic tests to Vitest beside source files.
- Consolidate browser tests under tests/e2e with one Playwright configuration.
- Use tagged suites and one complete browser run in the existing Pages workflow.

## Capabilities

### New Capabilities

- `accessible-interface`: Keyboard focus, modal behavior, feedback, and contrast.
- `test-workflows`: Unit/browser separation, browser matrix, and CI commands.

### Modified Capabilities

None. Existing gameplay and Pages release requirements continue to apply.

## Impact

UI components, styling, test tooling, package dependencies, documentation, and CI.
The hash routes and /type_instructor/ deployment base remain supported.
