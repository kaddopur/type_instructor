# Local verification

Verified on fix/mobile-safari-app-shell, including the final root-font and
cross-language layout changes committed with this archive. Earlier incremental
commits and their checks are listed in tasks.md and docs/ui-migration.md.

## Final checks

- pnpm lint: passed.
- pnpm typecheck: passed.
- pnpm test:unit: 15 tests passed across four Vitest files.
- CI=1 pnpm test:e2e: 120 tests passed across desktop Chromium, Firefox,
  WebKit and iPhone-size WebKit emulation (two workers, approximately 2.1 minutes).
- openspec validate --all --strict: nine existing specs passed before archive;
  all resulting specs are checked again after archival.
- git diff --check: passed before commit.

## Layout and font evidence

The dedicated geometry check covers en/zh/ja at 390×600, 844×390 and 1280×900.
It compares Home, Menu, language selection, basic/speedrun results and all four
quiz modes in intro, playing and feedback states. Other layout checks simulate
safe-area padding, confirm no document/inner overflow, compare language buttons
and check dialog widths, corners and single-line menu labels.

The complete suite also covers keyboard flows, axe scans, type-color contrast,
full game completion, resources, offline play and real worker updates. The
Pages resource check loads Cubic 11 and fetches it after an offline reload.
Cubic 11 covered all 88 unique Han characters in the corrected Chinese strings.
Chromium rendered-font inspection confirmed Cubic 11 alone renders both Japanese
result actions. Chinese/Japanese menus, Japanese results and the updated English
menu/landscape quiz screenshots were inspected during implementation.

## Scope limits

No physical iPhone Liquid Glass chrome or manual screen-reader verification was
performed. All results above are local. Push/PR creation follows this archive;
remote CI results and any deployment must be checked separately. No deployment
is requested by the archive/push/PR handoff.
