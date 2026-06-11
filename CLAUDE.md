# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vehicle Management System (VMS) — Traditional-Chinese internal tool. AI skill practice project with three independent packages:

- `src/skills/` — root package, ESM, Node ≥ 20. Agent skill examples tested with Jest.
- `apps/backend/` — Express 5 + pg (raw SQL) + CommonJS, port 3001.
- `apps/frontend/` — React 18 + Vite + React Router 6 + Tailwind CSS + Axios, port 5173.
- `openspec/` — change proposals, design specs, and tasks.

**The root, backend, and frontend have separate `node_modules` and are not npm workspaces.**

## Setup

```bash
# In project root (tibame-lesson2/)
docker compose up -d          # postgres :5432, pgAdmin :5050 — also auto-runs schema.sql + seed.sql

cd apps/backend && cp .env.example .env && npm install
cd apps/frontend && cp .env.example .env && npm install
npm install                   # root (Jest + ESLint for src/skills/)
```

## Daily dev

Start each app in its own terminal:

```bash
docker compose up -d
cd apps/backend && npm run dev    # node --watch src/index.js
cd apps/frontend && npm run dev   # vite (proxies /api → http://localhost:3001)
```

## Commands

| Context | Command | Notes |
|---------|---------|-------|
| Root | `npm run lint` | ESLint over `src/skills/` only |
| Root | `npm test` | Jest (ESM) over `src/skills/__tests__/` |
| Root | `npm run test:watch` | Jest watch mode |
| Backend | `npm run dev` | `node --watch src/index.js` |
| Backend | `npm start` | `node src/index.js` |
| Backend | `npm run seed:mock` | Load 10 employees + 15 vehicles (password `Mock1234!`) |
| Frontend | `npm run dev` | Vite dev server |
| Frontend | `npm run build` | Vite production build |

Single test file (root):
```bash
node --experimental-vm-modules node_modules/.bin/jest src/skills/__tests__/echo.test.js
```

## Database

The DB is initialized automatically by Docker mounting `apps/backend/src/db/schema.sql` and `seed.sql` into `docker-entrypoint-initdb.d/`. Init scripts only run on a fresh volume.

To reset to a clean state: `docker compose down -v && docker compose up -d`

Default seed accounts (password `Admin1234!`): `admin` (admin), `alice` (user), `bob` (user).

`npm run seed:mock` (from `apps/backend`) wipes all tables and loads richer test data: 10 users/employees across 4 departments + 15 vehicles across all statuses. Password for all mock accounts is `Mock1234!`. Blocked in `NODE_ENV=production`.

pgAdmin: http://localhost:5050 — `admin@example.com` / `admin`. Connect to host `postgres` (Docker hostname), not `localhost`.

## Architecture

### Backend (`apps/backend/` — CommonJS)

- `src/index.js` — Express app setup, CORS, cookie-parser, route mounting.
- `src/db/pool.js` — `pg.Pool` singleton, reads env vars.
- `src/lib/enums.js` — `VEHICLE_STATUSES`, `DEPARTMENTS`, `USER_ROLES` arrays used for validation in all route handlers. Frontend duplicates these values manually — there is no shared package.
- `src/middleware/authenticate.js` — verifies JWT from `req.cookies.token`; attaches `req.user`.
- `src/middleware/authorize.js` — role guard factory: `authorize(['admin'])`.
- `src/routes/` — `auth.js`, `vehicles.js`, `employees.js`, `dashboard.js`.

Auth flow: `POST /api/auth/login` → JWT signed with `JWT_SECRET`, stored as httpOnly `token` cookie (2h TTL). `GET /api/auth/me` returns the session user from the cookie.

Authorization: all `/api/employees` routes require `admin`. `DELETE /api/vehicles/:id` requires `admin`. Other vehicle routes require only authentication. Vehicles query joins employees to return `assigned_employee_name`.

`GET /api/dashboard/stats` — auth required (no admin), returns `{ totalVehicles, available, inUse, maintenance, retired, totalEmployees, vehicleStatusBreakdown[], monthlyVehicles[] }`.

`DELETE /api/employees/:id` — admin only. Blocked (409) if the employee is currently assigned to any vehicle; caller must unassign first. Also deletes the linked `users` row.

Employee POST/PUT use a `pg` client transaction (BEGIN/COMMIT/ROLLBACK) to keep `employees` and `users` rows in sync atomically.

### Frontend (`apps/frontend/` — ESM)

- `src/main.jsx` → `src/App.jsx` — React Router 6 with nested layout route.
- `src/pages/` — `LoginPage`, `DashboardPage`, `VehiclesPage`, `EmployeesPage`. `EmployeesPage` is wrapped in `AdminRoute` and only reachable by admins.
- `src/context/AuthContext.jsx` — `AuthProvider` calls `/api/auth/me` on mount to restore session; exposes `{ user, login, logout }` via `useAuth()`.
- `src/components/PrivateRoute.jsx` — `PrivateRoute` redirects unauthenticated users; `AdminRoute` redirects non-admins.
- `src/components/AppLayout.jsx` — sidebar + `<Outlet />` shell.
- `src/lib/api.js` — Axios instance with `baseURL: '/api'` and `withCredentials: true`.
- `@` alias resolves to `src/`.

Vite proxies `/api` to `http://localhost:3001`, so `FRONTEND_ORIGIN` in backend `.env` must stay `http://localhost:5173`.

### Root skills (`src/skills/` — ESM)

Minimal example skills for the practice project. Tests live in `src/skills/__tests__/`. The root `eslint.config.js` covers this directory; the `no-unused-vars`, `prefer-const`, and `eqeqeq` rules are enforced.

## Pre-commit hook

Husky runs `npm run lint` and `npm test` (root) in parallel and fails the commit if either exits non-zero. This only covers the root package — backend and frontend have no pre-commit checks.

## OpenSpec workflow

Change proposals, designs, and specs live under `openspec/`. Use the `openspec-*` skills (available via `/`) to create, continue, verify, and archive changes. Don't hand-edit specs without going through a change.
