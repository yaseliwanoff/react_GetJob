# Contributing to GetJob

## Branching model
- main: stable, release-ready
- develop: integration branch
- feature branches: feat/*, fix/*, docs/*, chore/*

## Commit convention
Follow Conventional Commits:
- feat: new feature
- fix: bug fix
- docs: docs only changes
- chore: tooling or maintenance
- refactor: code change that neither fixes a bug nor adds a feature
- test: adding tests
- ci: CI/CD changes

## Pull requests
- Target develop
- Keep PRs small and focused
- Add clear description and testing steps

## Local setup
- Node.js 18+
- MongoDB local or Atlas
- backend: copy .env.example to .env
- run backend and frontend dev servers
