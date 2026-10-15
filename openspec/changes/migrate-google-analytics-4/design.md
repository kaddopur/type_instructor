# Design

Use the existing localized-page effect after document.title is set. A small
helper lazily initializes dataLayer/gtag and the asynchronous Google script on
production builds at kaddopur.github.io. Queue manual page_view events with full
page_location (including the hash), current page_title and previous tracked URL
as page_referrer (document.referrer on first view). Suppress consecutive duplicate
URLs to avoid React StrictMode duplicates, but count returning to a prior page.

Set send_page_view:false. The site owner must also disable Enhanced Measurement's
history-based page views in the GA4 data stream to prevent duplicate collection.
No external-script await or dependency on analytics success is allowed in gameplay.
The build caches only local assets; the Google script remains external.

References:
- https://developers.google.com/tag-platform/gtagjs
- https://developers.google.com/analytics/devguides/collection/ga4/views
