# offline-updates Specification

## Purpose
TBD - created by archiving change modernize-offline-deployment. Update Purpose after archive.
## Requirements
### Requirement: Offline game assets
The production build SHALL precache all local application resources using Workbox
and allow the game to open, navigate, and answer questions offline after installation.
Development SHALL not register a service worker.

#### Scenario: Offline play
- **WHEN** a player installs the production worker online and then loses connectivity
- **THEN** reloading the site and playing a localized game work using cached assets

### Requirement: Legacy worker replacement
The application SHALL keep the existing service-worker.js URL and scope, bypass
HTTP script cache on updates, and activate successfully installed updates. Activation
SHALL delete only this scope's known legacy cache and stale entries in its own Workbox precache.

#### Scenario: Legacy upgrade
- **WHEN** a legacy sw-precache worker is controlling the site and the new build is installed
- **THEN** the new worker takes control, the next reload serves the new app, and another application's cache is preserved

### Requirement: Non-disruptive updates
Worker activation SHALL NOT automatically reload an open game. A subsequent page
reload SHALL use the installed new version and its offline cache.

#### Scenario: Update during play
- **WHEN** a new Workbox build activates while a game is running
- **THEN** the page retains its current game until reload, after which the updated build loads

### Requirement: Failed install recovery
An unsuccessful worker installation SHALL preserve the active worker and its cache.

#### Scenario: Missing new asset
- **WHEN** a new worker cannot fetch a required precache resource
- **THEN** the existing worker remains active and the player can still open its cached game offline
