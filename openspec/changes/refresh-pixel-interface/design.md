# Design

Use the first approved four-screen concept: warm canvas, white panels, charcoal
outlines, yellow primary actions, blue mode accents and existing type colors.
Keep Cubic/PKMN typography and a single root font scale. Fixed block slots and
responsive grids must accommodate all translations without moving controls.
Use native links/buttons, Radix modal behavior and existing focus management.

Progress is presentation only: basic mode shows remaining seconds; speedrun
shows a clamped 0–20 progress value while keeping the actual (possibly negative)
score visible. Store/timers and 500ms answer boundaries remain authoritative.

Small viewports use compact spacing; landscape places mode cards side by side
and uses a compact quiz layout. The AppShell retains dynamic viewport ownership
and all safe-area insets. Browser emulation does not prove iPhone Safari chrome.
