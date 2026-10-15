# Verification

- `pnpm lint` and `pnpm typecheck` passed.
- All 15 targeted Chromium cases passed: complete/retry/navigation in all twelve
  language/mode/question-kind combinations, three-language navigation, the
  introduction language links and the language picker.
- The picker check uses keyboard activation and covers selecting the current
  language, returning Home, focusing Start, retaining the menu language and
  preserving picker geometry after reopening at 390 x 600, 390 x 844 and
  844 x 390.
- The OpenSpec change passed strict validation before archival. Current specs
  were synchronized before archival, which uses `--skip-specs`.
- No physical-device or manual screen-reader validation is claimed.
