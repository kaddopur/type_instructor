# Complete migration acceptance and release

## Why

Steps 1–5 are implemented and archived. The user requested step 6 and the remaining
release work, including full acceptance, archive/commit, remote checks, and publication.

## What Changes

- Verify all three languages and four game modes through completion and replay.
- Cover desktop Chromium, Firefox, WebKit, and mobile WebKit emulation, layout,
  feedback/timer boundaries, browser navigation, offline use, and worker updates.
- Fix any demonstrated regressions without adding new gameplay.
- Add repeatable acceptance checks to CI and finish the baseline evidence/checklist.
- Archive and commit, push the branch, validate its PR, merge, deploy, and verify Pages.

## Capabilities

### New Capabilities

- `migration-acceptance`: Repeatable behavior and layout checks with explicit browser limits.

### Modified Capabilities

None unless acceptance reveals a behavioral defect requiring a spec update.

## Impact

Acceptance tests/config, CI, final documentation, and any evidenced compatibility
fix. Release uses the existing master-only Pages workflow. Remote Pages source was
read-only checked and is already workflow; no settings change is currently required.
