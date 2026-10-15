# Final acceptance and release

Date: 2026-10-15. Node 22.23.2, pnpm 11.22.0, Playwright 1.64.1 on macOS.

## Local acceptance

| Project | Complete game flows | Worker upgrade/offline | Result |
| --- | --- | --- | --- |
| Desktop Chromium | 12 | 1 | 13 passed |
| Desktop Firefox | 12 | 1 | 13 passed |
| Desktop WebKit | 12 | 1 | 13 passed |
| Mobile WebKit, iPhone 13 emulation | 12 | 1 | 13 passed |

Commands: `pnpm test:acceptance --project=chromium-desktop --max-failures=1`,
then the remaining three projects together. Total: 52 passed. Each project covers
English/Chinese/Japanese × basic/speedrun × attack/defense through actual completion,
result text/value, replay reset, browser back/forward, language-preserving navigation,
and direct hash reload.

Every game flow checks pre-start pause, a single one-second tick, negative scoring,
rapid duplicate inputs, translated damage feedback, 499/500 ms feedback, wrong-answer
retry, and next-question state. Basic completion answers exactly 500 ms before
expiry to cover concurrent feedback/countdown completion; the final score remains
correct. Speedrun checks 19/20-point completion and final-answer-time seconds.

Each project's worker test covers the actual archived sw-precache engine with a
reduced fixture asset list, a missing-resource installation failure, successful
Workbox takeover, offline localized play, a second Workbox revision, preservation
of root/nested-app cache contents, and no forced reload while playing.

### Discovered and fixed issue

The initial desktop test failed: an answer's bottom was 1011.1875px in a 720px-high
viewport. Percentage vertical padding scaled with viewport width, clipping the
second row. Quiz.css now caps each row at 25dvh while keeping 37.5% sizing on narrow
screens, and uses 100dvh with a vh fallback. All four answer bounds now pass in all
four projects. Desktop Chromium and mobile WebKit screenshots were also inspected.

## Other checks

- Native logic baseline: 12 passed; dependency audit: no known vulnerabilities.
- Workflow static validation: actionlint v1.7.12 passed (optional shellcheck disabled).
- OpenSpec strict validation and whitespace checks passed.
- Clean installation: removed generated node_modules, then `pnpm install --frozen-lockfile` passed without overrides.
- Final `pnpm test`: 12 passed; `pnpm test:smoke`: production build and 7 browser tests passed.

## Release progress

Local changes are ready for a PR. Remaining: remote CI, merge, Pages deployment,
live verification, final archive, and release references. The Pages source was
read-only checked as workflow; no Pages settings mutation was needed.

## Practical limits

Playwright WebKit is not the installed Safari application, and mobile device
profiles emulate viewport/input behavior rather than a physical iPhone. Physical
iOS/Android hardware and every possible browser version are not tested. The local
worker fixture uses the original engine with a smaller asset list, not a complete
archived 2016 frontend or an existing user's browser profile.
