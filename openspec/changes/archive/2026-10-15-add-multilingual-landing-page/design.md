# Design

Use the existing warm canvas, yellow/blue accents and pixel headings. Longer
explanations use a readable system body font. The page is an article in the
existing main landmark, with direct language links and localized play actions.
Screenshots come from production Chromium renders, recorded with source revision
and viewport. No generated UI images or external image hosts are used.

The landing article scrolls within the existing safe-area viewport. Other routes
keep the existing no-scroll shell. Hash routing remains Pages-compatible; the
how-to action scrolls to a local element without replacing the router hash.
Mobile stacks text/images, desktop uses a bounded two-column layout.
