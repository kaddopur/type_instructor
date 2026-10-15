# Verification

## Local result

The final runtime source, including the updated app icons, passed:

- pnpm lint and pnpm typecheck.
- pnpm test:unit: 15 tests in four files.
- CI=1 pnpm test:e2e: 120 tests, two workers, approximately 2.2 minutes.
- Production Vite/Workbox generation as part of browser validation.
- OpenSpec strict validation before and after archival.
- git diff --check before commit.

The complete matrix covers desktop Chromium, Firefox, WebKit and iPhone-size
WebKit emulation. It includes all three languages, complete gameplay, keyboard
flows, axe audits, all 18 type-color contrast checks, offline/update fixtures,
font delivery and icon URLs/dimensions. Progress assertions verify a negative
score displays zero progress and each correct score advances toward 20 points;
the basic mode has no score progress bar.

Layout checks cover 390×600, 844×390 and 1280×900, comparing positions, sizes,
font sizes and radii across locales. Safe-area checks verify controls remain
inside simulated insets without document/inner scrolling. These are automated
layout checks, not a physical iPhone claim.

## Visual evidence

Actual Chromium screenshots in docs/ui-refresh were inspected for Home, Menu,
Lang, intro, quiz feedback, results and landscape Menu. The generated concept
was used as a design reference; runtime screenshots are the review artifact.
The 32px and 256px pixel-T icons were also visually inspected.

## Commit sequence

1. 35a3c12: visual foundations.
2. 021242b: Home.
3. b1d6da7: Menu.
4. 9f7056e: language selection.
5. 8b5083f: start dialog.
6. 2b8f90c: Quiz.
7. 992b3f8: Result.
8. The archive commit: verification refinements, icons, screenshots and docs.

## Release limits

No physical iPhone expanded/collapsed Liquid Glass chrome, installed iOS mode,
or manual screen reader was tested. The PR handoff must retain these limits.
At archival time, checks above are local; remote CI and deployment are not
claimed. PR creation follows the archive commit. Deployment requires the
existing master-only workflow after merge.

The user asked whether the original Japanese quiz stem is clear. The response
recommended separating the enemy condition from the requested choice. That
copy proposal was not treated as approval for a wording change in this release.
