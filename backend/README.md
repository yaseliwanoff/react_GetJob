# Backend (Express + Supabase)

## Setup
```
npm install
cp .env.example .env
npm run dev
```

## Structure
- config/superbase.js: Supabase client factory
- config/supabase.js: compatibility shim for imports
- models/: Data access using Supabase queries
- controllers/: Business logic
- routes/: API routes (auth, users, jobs, applications, saved jobs, analytics)
- middlewares/: auth (JWT), uploads (multer)

## Environment variables

Create `.env` in `backend/` with:

```
PORT=5000
CLIENT_URL=http://localhost:5173

# Auth
JWT_SECRET=replace_with_strong_secret

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Notes

- Legacy `config/db.js` and Mongo-specific code were removed/migrated to Supabase.
- Some modules still import `../config/supabase`; the shim re-exports from `superbase.js`.
