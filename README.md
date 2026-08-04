# MITS NSS Portal — Full Stack Setup

This package contains two projects that now work together:

- **`nss-compass-backend/`** — Spring Boot + MySQL REST API
- **`nss-compass-front-main/`** — React + TanStack Start frontend, now wired to call that API

## Quick Start

### 1. Backend

```bash
cd nss-compass-backend
# create a MySQL DB called nss_compass (or let the app auto-create it — see its README)
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export CORS_ALLOWED_ORIGINS=http://localhost:3000
mvn clean install
mvn spring-boot:run
```
Runs on **http://localhost:8080**. On first run it seeds an admin account, 60 demo
volunteers, 15 demo events, attendance records, and announcements — the app is usable
immediately. Full API reference is in `nss-compass-backend/README.md`.

**Default admin login:** `admin@mits.ac.in` / `Admin@123` (override via `ADMIN_EMAIL` /
`ADMIN_PASSWORD` env vars before first run).

### 2. Frontend

```bash
cd nss-compass-front-main
cp .env.example .env      # then edit VITE_API_URL if your backend isn't on localhost:8080
npm install
npm run dev
```
Runs on **http://localhost:3000** (TanStack Start default) — check the terminal output for
the exact port.

## What was changed in the frontend

The original project was 100% frontend with static dummy data (`src/data/*.ts`). That
folder has been removed and replaced with a real API layer:

- **`src/lib/api.ts`** — a typed fetch client for every backend endpoint (auth, volunteers,
  events, attendance, stats), including JWT storage in `localStorage` and file-upload
  helpers for the event form.
- **`login.tsx`** — now calls `POST /api/auth/login` and stores the returned JWT.
- **`dashboard.tsx`** — the `/dashboard/*` route tree now redirects to `/login` if no token
  is present (client-side guard — see note below).
- **`dashboard.volunteers.tsx`** — full CRUD wired to `/api/volunteers` with server-side
  search, filtering, sorting and pagination via React Query.
- **`dashboard.events.tsx`** — the "Add Event" form now uploads the banner, PDF report, and
  gallery images as `multipart/form-data` to `POST /api/events`.
- **`dashboard.attendance.tsx`** — event dropdown and volunteer roster are now live; "Save
  Attendance" posts to `/api/attendance/mark`.
- **`dashboard.index.tsx`** — summary cards and all three charts now pull from
  `/api/stats/*`.
- **`attendance.tsx`** (public tracker) — roll-number lookup now calls
  `/api/attendance/lookup`.
- **`events.tsx`** (public listing) — event cards and the detail modal now come from
  `/api/events`, including uploaded banners/gallery images.
- **`index.tsx`** (homepage) — "Latest Announcements" now comes from
  `/api/stats/announcements`. The hero carousel images stay as static decorative stock
  photos (they were never domain data).

## Known limitations / things worth doing next

1. **Auth guard is client-side only.** `dashboard.tsx`'s `beforeLoad` checks
   `localStorage` for a token, which isn't available during server-side rendering in this
   TanStack Start app. A direct/first-load request to a `/dashboard/*` URL will render on
   the server before the client-side check kicks in and redirects. For production, consider
   moving the JWT into an httpOnly cookie so the server can check it too, or fully
   client-render the dashboard route tree.
2. **Attendance "prefill"**: `dashboard.attendance.tsx` always starts each event's marking
   grid blank rather than pre-loading previously saved marks (the backend's
   `GET /api/attendance/event/{id}` endpoint is available for this — wiring it up is a small
   follow-up if you want it).
3. **File storage is local disk** (`UPLOAD_DIR` on the backend) — fine for a single-server
   deployment; swap `FileStorageService` for S3/Cloud Storage before scaling out.
4. **Volunteer CSV/Excel import & export** buttons are still placeholders (`toast.info(...)`)
   — the original frontend never implemented these either.
