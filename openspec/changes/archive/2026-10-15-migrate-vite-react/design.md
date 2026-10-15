# Design

Use Vite with its standard React plugin and a /type_instructor/ base. Rename only
files containing JSX to .jsx. Use explicit relative module extensions so Node's
baseline tests can load production logic without a custom resolution hook.

React 19 requires createRoot and compatible Redux bindings. Router 2 uses legacy
React context, so replace it with the current declarative HashRouter now, removing
react-router-redux. The existing I18nPage wrapper obtains route params, location,
and navigate with Router hooks and keeps its existing localization responsibility.
Redux gameplay state and class-based pages remain until step 3.

Move deprecated lifecycle work to mount/update lifecycle methods with timer
cleanup. This is required integration work; Redux removal remains step 3, now
targeting Zustand per the user's updated decision.
The two known bugs remain documented and unchanged for step 4.

Move manifest/favicon/cache polyfill to public. Preserve existing sw-precache
generation for now and register it only in production using the configured base.
Step 5 replaces legacy offline tooling and handles previously installed workers.
Do not run the obsolete history-rewriting deploy command against Vite output.
