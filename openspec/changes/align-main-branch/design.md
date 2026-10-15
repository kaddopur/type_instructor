# Design

Use explicit main filters for push/pull_request and refs/heads/main for both
artifact upload and the deploy job. Keep manual validation on other branches,
PR non-deployment, shard-1-only artifact upload, both-shard success and the
existing deployment concurrency/OIDC settings.

The existing github-pages environment uses a custom branch policy named master.
Rename that same policy to main without changing the broader environment rules.
Pages is already configured with build_type=workflow, so its legacy gh-pages
source metadata does not require changing.

Validate parsed workflow triggers and deployment conditions across push, PR and
manual events, both shards, and main/other refs. Check the remote policy after
updating it. Full browser regression is unnecessary for branch-name-only edits;
run existing lint, typecheck, unit and strict OpenSpec validation.
