# Design

Put SCORE_TARGET in src/lib/gameRules.js to share between the Zustand store and
Quiz instructions. Replace the single {scoreTarget} placeholder in GOAL_SPEEDRUN
at render time; no general formatting library is needed.

Keep the existing 500 ms final-answer feedback, +/-1 scoring, and integer seconds
captured at the final correct answer. At 19 points the game continues; at 20 it
finishes after feedback. Preserve existing URLs and fix only the incorrect menu entry.

Use native Node store tests for the explicit 20-point contract and deduction near
the threshold. Browser tests cover localized entry routes/instructions and actual
19-to-20 progression, feedback, result navigation, and replay.
