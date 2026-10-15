# Verification

2026-10-15; Node 24.19.0 and pnpm 11.22.0.

- Parsed `.github/workflows/pages.yml` with Ruby's standard YAML library.
  Asserted main push/PR filters, manual trigger, shards [1, 2], dist upload and
  deploy dependency on the build matrix. Evaluated both condition expressions
  for the Cartesian product of push/pull_request/workflow_dispatch,
  main/master/feature, and shards 1/2: all 18 cases passed.
  PRs never upload/deploy; main push/manual runs upload only from shard 1;
  non-main refs never publish. Both shards must still succeed for deployment.
- `pnpm lint`, `pnpm typecheck`: passed.
- `pnpm test:unit`: 23 cases passed across 6 files.
- `openspec validate align-main-branch --strict`: passed before archive.
- `git diff --check`: passed.

Remote readback:
- Repository defaultBranchRef is main; no open PRs require retargeting.
- Updated existing github-pages branch policy 63104846 from master to main;
  GET deployment-branch-policies returns exactly one branch policy, named main.
- Environment retains custom_branch_policies=true and protected_branches=false.
- Pages build_type remains workflow. Legacy source.branch=gh-pages metadata is
  not used as the publishing trigger, so it was retained.
- `git remote set-head origin -a` updated local origin/HEAD from master to main.

Current specs and docs are updated; historical archives and a third-party
sw-precache source URL intentionally retain master references.
The initial branch-name-only checks did not rerun browser tests because
application code and build behavior did not change; see the CI follow-up below. Remote workflow execution and a deployed release of this change
remain pending push/merge to main.

## CI follow-up: palette clock race

CI reported `clock.pauseAt: Cannot fast-forward to the past` in the Firefox
palette contrast test. It installed a real-time clock, then used the test
runner's `new Date()` as the pause target. Browser time could pass that target
before the call arrived. The test now uses the same fixed installation time and
10-second-later pause target as the existing gameplay/navigation tests.
No gameplay or contrast assertions changed, and all 18 types are still checked.

- Firefox palette test repeated 20 times with two workers: 20 passed (33.8s).
- `pnpm lint`: passed.
- `CI=1 pnpm test:e2e --shard=1/2`: 80 passed with two workers (1.3m),
  including the previously failing Firefox palette case.
