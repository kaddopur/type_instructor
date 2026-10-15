# Pixel UI refresh

This implementation follows the first approved four-screen preview: warm canvas,
white panels, dark outlines, yellow primary actions, blue mode accents, pixel
fonts and the existing Pokémon type palette. Actual browser captures are below.

| Screen                    | Screenshot                               |
| ------------------------- | ---------------------------------------- |
| Home                      | [home.png](home.png)                     |
| Menu                      | [menu.png](menu.png)                     |
| Language                  | [language.png](language.png)             |
| Start dialog              | [intro.png](intro.png)                   |
| Quiz feedback             | [quiz.png](quiz.png)                     |
| Japanese attack question  | [quiz-attack-ja.png](quiz-attack-ja.png) |
| Japanese defense question | [quiz-defend-ja.png](quiz-defend-ja.png) |
| Result                    | [result.png](result.png)                 |
| Landscape Menu            | [menu-landscape.png](menu-landscape.png) |

The captures use Chromium at 390×844 and 844×390. They show the implemented
interface, including its initial keyboard focus ring, rather than generated art.

## Eight implementation commits

1. Shared colors, typography and controls (`35a3c12`).
2. Home decoration, title and grouped actions (`021242b`).
3. Mode cards, descriptions and paired actions (`b1d6da7`).
4. Checked, pale-yellow language selection (`9f7056e`).
5. Mode label, goal and compact start dialog (`8b5083f`).
6. Quiz hierarchy, fixed feedback and score progress (`2b8f90c`).
7. Result emphasis and primary Retry (`992b3f8`).
8. Responsive refinements, complete verification, matching app icons,
   documentation and OpenSpec archive (the final commit in this branch).

## Invariants

- Locale changes do not resize controls or move their layout slots.
- The shared AppShell retains safe-area handling and dynamic viewport height.
- Basic games remain 60 seconds; speedruns target 20 score points, not minutes.
- Correct/wrong answers still score +1/−1 with the existing 500ms boundary.
- Progress is clamped for presentation; the actual score remains visible.
- Native controls, focus management and Radix dialog semantics are retained.
- Fonts and icons are local and work under the Pages base and offline cache.

## App icon

The source is `public/favicon.svg`: a pixel T in charcoal on yellow with a blue
corner. The same artwork supplies the ICO/32px tab icon, 180px Apple icon and
256px/512px manifest icons. It uses native SVG paths, not a new font dependency.
Old 128px/152px cover files are removed. The 256px filename remains for the
manifest and offline-update fixture.

## Verification limits

Playwright's mobile WebKit project does not reproduce physical iPhone Safari
Liquid Glass chrome. Browser-bar expanded/collapsed states and installed iOS
mode still need a physical device; manual screen-reader checks were not run.
A PR is the release handoff. A passing local suite does not claim deployment.

## Final local checks

Lint, TypeScript, 15 unit tests and the complete 120-case browser matrix passed
on the final runtime source, including the new icon resources. OpenSpec strict
validation and whitespace checks also pass. Progress clamps and current-language
checks are included in the existing browser cases.

## Follow-up: explicit quiz questions

After approving the attack/defense comparison mockup, the user requested a
separate copy/layout change. The colored card now labels the enemy type (attack)
or enemy attack type (defense). A separate question below asks which attack
maximizes damage or which own type minimizes it. The type name has no parentheses.
Each translation has a deliberate two-line question in a fixed slot. The first
answer and answer group describe both the condition and question for keyboard
and assistive-technology context. Core gameplay and scoring remain unchanged.

This follow-up is a ninth commit, additional to the completed eight-step refresh;
it is recorded in the separate clarify-quiz-questions OpenSpec archive.
