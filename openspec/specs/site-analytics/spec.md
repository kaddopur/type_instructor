# site-analytics Specification

## Purpose

Define production GA4 page-view collection for the hash-routed site, local-test exclusion, and the account settings needed to avoid duplicate views.

## Requirements

### Requirement: Production GA4 page views

The system SHALL use G-6H3DMT5TLL on production builds served at
kaddopur.github.io and SHALL remove the retired UA tracking snippet.

#### Scenario: Initial page and route changes

- **WHEN** a localized page renders or the player navigates to another page
- **THEN** send a manual page_view with the full hash URL, updated page title and referrer
- **AND** initialize the Google tag once with send_page_view:false

#### Scenario: Duplicate effects and returning to a page

- **WHEN** the current URL is tracked repeatedly without navigating away
- **THEN** queue only one page_view
- **AND** returning after visiting another URL queues another view

#### Scenario: Local development or preview

- **WHEN** the build is development or the hostname is not kaddopur.github.io
- **THEN** do not load Google scripts or initialize analytics

#### Scenario: Google script unavailable

- **WHEN** the Google script is blocked or offline
- **THEN** page navigation and gameplay remain usable and analytics calls stay queued

### Requirement: Analytics setup documentation

The project SHALL document the manual-page-view strategy and the GA4 setting
needed to avoid duplicate history-based collection.

#### Scenario: Site owner verifies deployment

- **WHEN** the owner follows the README
- **THEN** they can disable automatic history-based page views and verify collection in Realtime or DebugView after deployment
