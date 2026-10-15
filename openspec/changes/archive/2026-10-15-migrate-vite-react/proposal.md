# Migrate to Vite and React

## Why

The application still uses React 15 and Create React App 0.4. Establish a working
modern development and production build before changing gameplay or state ownership.

## What Changes

- Replace react-scripts with Vite and its React plugin; commit a lockfile and Node version.
- Upgrade React/React DOM together and use createRoot and JSX module entry points.
- Upgrade Router and React Redux as required for React 19. Remove incompatible
  react-router-redux; keep the existing Redux gameplay reducer until step 3.
- Preserve hash URLs, translations, styles, game rules, and the known step-4 bugs.
- Make static assets and the existing offline build work beneath /type_instructor/.

## Capabilities

### New Capabilities

- `development-build`: Reproducible Vite development, test, and production commands.

### Modified Capabilities

None. Existing gameplay and navigation baselines remain the acceptance reference.

## Impact

Build configuration, package manifest/lock, React entry and router integration,
JSX filenames, JSON loading, static assets, and development documentation.
Modern offline tooling and Pages deployment automation remain step 5.
