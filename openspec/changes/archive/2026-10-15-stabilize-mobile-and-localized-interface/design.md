# Design

## Shared viewport

AppShell owns 100dvh (with a vh fallback), all four safe-area insets and the
main landmark. viewport-fit=cover enables explicit safe-area handling. Pages
fill its available content box. Document and inner scrolling are disabled;
short screens use less spacing and landscape menus place modes side by side.

## Stable localized layouts

The root font size is a CSS constant, 125% (normally 20px), independent of the
selected language. Earlier local fixes used explicit dimensions for Home,
Menu and language selection; the shared root now also stabilizes rem-based
result, quiz and dialog dimensions. Home keeps its larger responsive title,
24px Start text, 20px author text and 175px Start width. Dialog actions share
a maximum 240px width and 24px corners. Results use 240px actions to avoid
Japanese wrapping. Intro descriptions reserve two lines and quiz feedback
uses the full stem width.

Translation text may have different natural widths. The invariant is the
layout of controls and containers; footer text keeps its center and line height.

## Font delivery

Cubic 11 WOFF2 is copied unmodified from upstream revision
4c566f7d6cc5c05ee360fe9cff56b5da1fcafd4d with its OFL license. Unicode ranges and
language stacks apply it to CJK text; Japanese kana, kanji and punctuation use
one font. PKMN/GB retain Latin/digits. Vite bundles the font and Workbox
precaches it. Unused Early GameBoy assets and redundant GB WOFF are removed.

## Verification limits

Playwright WebKit emulation cannot reproduce iPhone Safari's Liquid Glass
browser chrome. Physical-device browser-bar states and manual screen readers
were not tested. No claim of deployment or remote CI is made by this archive.
