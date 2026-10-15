# Verification

Date: 2026-10-15. Node 24.19.0, pnpm 11.22.0.

## Results
- `pnpm test:unit`: 21 tests passed in 5 files.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed with no warnings.
- `pnpm exec playwright test --workers=4`: 152 passed (1.5 minutes).
  Chromium desktop, Firefox desktop, WebKit desktop and iPhone 13-sized WebKit;
  38 cases per project. Production build and service-worker generation passed
  as part of the Playwright web-server startup.
- `pnpm exec playwright test --list --shard=1/2` and `--shard=2/2`:
  76 tests per CI shard.
- `openspec validate improve-quiz-generation --strict`: passed before archive.
- `openspec validate --all --strict`: all 12 main specs passed after archive.
- `git diff --check`: passed.

## Acceptance coverage
- Generator unit checks cover ten shuffled rounds for both quiz kinds, forced
  bag-boundary collisions under constant randomness and independent generators.
- Store regression checks collect two rounds while interleaving wrong attempts,
  timer ticks and a second session, preserving coverage and avoiding repeats.
- Defense checks cover all 18 targets under both preferences, unique best
  answers, immunity exclusion in resistance questions, three alternating rounds
  and fresh-session preference reset. Electric and dragon have explicit checks.
- Browser checks use an independent matchup fixture to solve the displayed
  options; no application answer is exposed to the tests. Both quiz kinds run
  two full bags in every browser project, checking coverage, no adjacent repeats,
  answer multipliers and scores. Defense round two requires 0.5 for every target.
- Existing language, keyboard, scoring, 20-point completion, retry, layout,
  accessibility and offline-update checks all pass with changing targets.

## Limits
Coverage is balanced by target, not by correct-answer type or difficulty.
Targets with immunity begin with immunity practice; their resistance practice
starts in round two. No persisted history, difficulty tiers or delayed review.
Browser device emulation does not replace testing on physical phones.
