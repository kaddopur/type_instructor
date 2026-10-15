# Acceptance and release design

Keep the existing smoke suite as the quick Chromium check. A separate acceptance
config reuses its production server and runs all 12 language/mode combinations
on desktop Chromium, Firefox, WebKit, and mobile WebKit emulation, plus the existing
real worker-upgrade integration on each engine.

Use a paused browser clock and a fixed normal-type enemy to verify scoring, exact
500 ms feedback, the final countdown/feedback race, 19/20-point completion, replay,
and browser history without waiting real minutes or exposing internal state.

Initial acceptance demonstrated clipped answer choices: at 1280×720, a choice's
bottom was 1011.1875px because percentage padding scaled height with viewport width.
Cap each answer row at 25dvh, retaining the original 37.5% sizing on narrow screens.
Use 100dvh with a vh fallback for the game viewport. Assert all four bounds.

Run the same acceptance matrix in remote CI before merging. Pages is already set
to workflow. Publish through the existing master-only workflow and verify the
actual live asset revision and game. Record browser emulation and physical-device
limits rather than claiming real-device coverage.
