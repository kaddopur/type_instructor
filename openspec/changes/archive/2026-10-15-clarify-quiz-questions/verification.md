# Verification

The user approved the generated attack/defense comparison before implementation.
This follow-up is additional to the eight completed UI-refresh commits.

## Local checks

- pnpm lint and pnpm typecheck passed.
- Chromium targeted layout/gameplay checks: 19 passed before final phrase wrapping.
- Final complete browser matrix: 120 passed (two workers, approximately 2.2 minutes).
- Matrix: desktop Chromium, Firefox, WebKit and mobile WebKit emulation.
- Existing complete games now assert condition label, explicit question, unparenthesized
  type name and accessible answer-group context in all three languages and four modes.
- Cross-language geometry checks include the separate instruction slot in intro,
  playing and feedback states at portrait, landscape and desktop sizes.
- Keyboard/axe, all type-color contrast, resource and offline-update checks passed.
- Chromium rendered-font inspection confirmed Pokemon GB for both English questions
  and Cubic 11 alone for both Chinese and Japanese questions, without system fallback.
- Actual Japanese attack/defense screenshots were inspected after adding deliberate
  phrase-boundary line breaks. docs/ui-refresh also contains updated Chinese feedback.
- OpenSpec strict validation and git diff --check passed before commit.

## Rules and limitations

The damage matrix, strongest/weakest answer selection, scoring, timers and 500ms
feedback boundary are unchanged. No physical iPhone or manual screen-reader check
was performed. Existing eight-step revision 28f3610 passed remote CI run
38699057021; the new follow-up revision must receive its own CI result after push.
No merge or deployment is claimed by this record.
