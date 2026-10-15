# Design

A createQuizGenerator(quizType) closure belongs to each store. It shuffles all
18 types, deals one per generated question and refills only when empty. If the
first item of a new bag equals the previous target, swap it with the second item.
This bounded operation also works with a constant random source. Wrong-answer
retries and timer ticks do not consume targets; completed games do not generate
another question. New stores have independent bags and defense history.

getQuiz accepts an explicit target (or picks one for standalone callers) and a
defense preference. Each target starts with an immunity preference, then toggles
to resistance on its next appearance. Preference state is per target, so shuffled
round order cannot starve either category. If immunity is absent, use resistance;
if resistance is absent (normal), use immunity. A resistance question samples its
answer from 0.5 matchups and distractors only from 1 or 2 matchups. Immunity
questions keep 0 as the answer and sample any strictly worse multiplier. Attacks
continue to choose 2 and exclude all other equally effective answers.

This balances targets, not answer-type frequency or difficulty. First-round
immunity questions are intentionally preserved; resistance practice for targets
with immunity begins in the second round. No adaptive model or persisted history.

Tests cover multiple complete bags, forced boundary collisions, constant RNG,
all targets and both defense preferences, session isolation, wrong-answer retries,
and speedrun completion. Browser tests use a separate matchup fixture to select
the best of the visible options instead of pinning one answer for an entire game.
