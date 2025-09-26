# Architecture

- Frontend: React (Vite), communicates with backend via REST using Axios
- Backend: Node.js/Express with route/controller/service layers
- Database: MongoDB via Mongoose models
- Auth: JWT-based, HTTP-only cookies or Authorization header (see implementation)

## Key directories
- backend/controllers: request handling
- backend/routes: route mapping
- backend/models: Mongoose schemas
- frontend/src: React app (components, pages, context)
