# Replace retired analytics with GA4

## Why
The site still loads analytics.js for UA-6593436-4. The user supplied the GA4
measurement ID G-8QLYXMMJSV to restore collection.

## What Changes
- Replace UA with the Google tag, initialized once on the production Pages host.
- Send manual page views after localized page titles update, including hash routes.
- Exclude development and local previews; queue events when the tag is blocked.
- Document the required GA4 history-measurement setting and verification steps.

## Capabilities
### New Capabilities
- site-analytics: Production GA4 page views.

## Impact
HTML, shared localized-page effect, analytics helper, tests and README.
No dependencies, gameplay changes, custom gameplay events or GA account changes.
