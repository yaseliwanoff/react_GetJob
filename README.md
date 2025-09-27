# GetJob

A full‑stack job portal with a React (Vite) frontend and a Node.js/Express backend. Originally built with Supabase, the backend has been migrated to Supabase for data storage and auth. The app enables job seekers to discover and save jobs, and employers to post and manage listings.

## Tech stack
- Frontend: React + Vite
- Backend: Node.js, Express
- Database: Supabase (Postgres) via `@supabase/supabase-js`

## Monorepo structure
```
JobPortal/
  backend/      # Express API, models, routes, controllers
  frontend/     # React client (Vite)
```

## Quick start

Prerequisites:
- Node.js 18+
- npm 9+
- Supabase (local or cloud, e.g. Atlas)

1) Backend
- Copy `.env.example` to `.env` in `backend/` and fill in values
- Install deps and run:
```
cd backend
npm install
npm run dev
```
Server starts on http://localhost:5000 by default.

2) Frontend
```
cd frontend
npm install
npm run dev
```
App starts on http://localhost:5173 by default.

## Environment variables
Create `backend/.env` with e.g.:
```
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_strong_secret

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

## Scripts
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## API overview
See `backend/controllers` and `backend/routes`:
- Auth: register/login
- Jobs: CRUD for job postings
- Applications: create/view
- Saved jobs: save/unsave listings
- Analytics: basic metrics

## Development workflow
- Branching: `main` (stable), `develop` (integration), feature branches `feat/*`, `fix/*`, `docs/*`, `chore/*`
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`
- PRs into `develop`; release from `main`

## Contributing
See `CONTRIBUTING.md` for setup, branching and commit guidelines.

## License
Choose a license before releasing publicly.
