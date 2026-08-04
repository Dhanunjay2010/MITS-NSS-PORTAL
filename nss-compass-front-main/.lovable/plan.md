## MITS NSS Portal — Frontend Build

A responsive, professional portal with a public website and an admin dashboard, using dummy data only (no backend).

### Design system
- Tokens in `src/styles.css` (`@theme inline`): NSS Red `#C62828` (primary), Dark Blue `#0D47A1` (secondary/accent), White, Light Gray `#F5F5F5` surfaces.
- Distinctive type pairing (display + clean sans) loaded via `<link>` in `__root.tsx`; subtle card elevation and gradient hero treatment — no generic purple gradients.

### Dummy data (`src/data/`)
- `volunteers.ts` — 100+ records: name, roll no, department, year, email, phone, hours, blood group, status.
- `events.ts` — 20+ records: title, date, venue, category, description, banner image, participants, gallery.
- `stats.ts` — counters and chart series for the dashboard.

### Public website
- `index.tsx` — hero, image carousel, About NSS, Activities grid, animated stat counters, Announcements.
- `events.tsx` — filterable/searchable card grid + detail modal, load-more pagination.
- `attendance.tsx` — search by roll number, result card with per-event attendance table and percentage.
- `login.tsx` — admin login form with validation and password toggle (dummy auth → redirects to dashboard).
- Shared `SiteHeader` (sticky, mobile menu) and `SiteFooter`.

### Admin dashboard
- `dashboard.tsx` — collapsible shadcn sidebar layout + topbar.
- `dashboard.index.tsx` — KPI cards plus bar/line/pie charts (recharts).
- `dashboard.events.tsx` — event creation form: date picker, category select, banner + gallery upload with image previews, PDF report stub.
- `dashboard.volunteers.tsx` — data table with search, department/year filters, column sorting, pagination, add/edit/delete dialogs.
- `dashboard.attendance.tsx` — pick event, then mark Present/Absent per volunteer with sticky header and summary bar.

### Technical notes
- TanStack Start file-based routes; each content route gets its own `head()` metadata (unique title/description/OG tags).
- Client-side state only (React state); toasts via sonner, `<Toaster />` mounted in `__root.tsx`.
- Sidebar widths use explicit `var(--sidebar-width)` syntax for Tailwind v4.
- Deps: recharts, framer-motion, react-hook-form + zod, embla-carousel-react, date-fns.
- Typecheck at the end.

Note on GitHub: pushing is handled by Lovable's GitHub sync (+ menu → GitHub → Connect project). Once connected, these changes sync automatically.