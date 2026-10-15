# Align deployment with the main default branch

## Why
The repository default branch is now main. The Pages workflow still targets
master, and the github-pages environment still only allows master deployments.

## What Changes
- Trigger push/PR validation on main and permit artifact publication/deployment
  only on main after both validation shards succeed.
- Rename the existing environment branch policy from master to main.
- Update current instructions and specs while retaining historical archive
  records and third-party source URLs.

## Capabilities
### Modified Capabilities
- pages-deployment: Main-only publication.
- migration-acceptance: Release acceptance on main.
- test-workflows: Shared checks gate main publication.

## Impact
GitHub Actions, deployment environment policy, README, current UI migration
instructions and OpenSpec. No application behavior or dependency changes.
