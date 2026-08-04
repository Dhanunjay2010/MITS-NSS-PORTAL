# MITS NSS Portal — Backend (Spring Boot + MySQL)

REST API backend for the **MITS NSS Portal** frontend (React + TanStack Start).
Provides authentication, volunteer management, event management (with file uploads),
attendance tracking, and dashboard statistics.

## Tech Stack

- Java 17, Spring Boot 3.3.4
- Spring Web, Spring Data JPA, Spring Security
- MySQL 8
- JWT auth (jjwt)
- Lombok

## 1. Prerequisites

- JDK 17+
- Maven 3.9+ (or use the included `mvnw` if you add one)
- MySQL 8 running locally or remotely

## 2. Create the database

You don't have to create the schema by hand — Hibernate will create tables automatically
(`ddl-auto: update`) and the app auto-creates the database itself
(`createDatabaseIfNotExist=true`) as long as the MySQL user has permission. If your user
doesn't have that permission, create it manually:

```sql
CREATE DATABASE nss_compass CHARACTER SET utf8mb4;
```

## 3. Configure environment variables

All config has sensible local defaults (see `src/main/resources/application.yml`), but for
anything beyond local dev, set these environment variables:

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `nss_compass` | Database name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | `root` | MySQL password |
| `JWT_SECRET` | (dev default — **change in production**) | HMAC signing key for JWTs |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | JWT expiry in ms |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Comma-separated list of allowed frontend origins |
| `UPLOAD_DIR` | `uploads` | Local folder for event banners/reports/gallery images |
| `ADMIN_EMAIL` | `admin@mits.ac.in` | Seeded admin login email |
| `ADMIN_PASSWORD` | `Admin@123` | Seeded admin login password |

Example (Linux/macOS):
```bash
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 4. Run it

```bash
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

On first run, `DataSeeder` automatically populates:
- 1 admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- 60 demo volunteers
- 15 demo events
- Attendance records for those volunteers/events
- 3 announcements

It's safe to restart — the seeder only inserts when tables are empty.

## 5. API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | `{ email, password }` → `{ token, email, name }` |

### Volunteers (admin — send `Authorization: Bearer <token>`)
| Method | Path | Description |
|---|---|---|
| GET | `/api/volunteers?query=&department=&year=&sortKey=&sortDir=&page=&size=` | Paginated, searchable, filterable, sortable list |
| GET | `/api/volunteers/{id}` | Get one |
| GET | `/api/volunteers/by-roll/{rollNo}` | Get one by roll number |
| POST | `/api/volunteers` | Create |
| PUT | `/api/volunteers/{id}` | Update |
| DELETE | `/api/volunteers/{id}` | Delete |

### Events
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/events` | Public | List all events (newest first) |
| GET | `/api/events/{id}` | Public | Get one event |
| POST | `/api/events` | Admin | `multipart/form-data` — fields + optional `banner`, `report`, `images` files |
| PUT | `/api/events/{id}` | Admin | Same as above, for editing |
| DELETE | `/api/events/{id}` | Admin | Delete |

Uploaded files are served back at `/uploads/<subfolder>/<file>` (e.g. `/uploads/banners/xxx.jpg`).

### Attendance
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/attendance/lookup?rollNo=22J41A1000` | Public | Used by the public Attendance Tracker page |
| GET | `/api/attendance/event/{eventId}` | Admin | Existing attendance marks for an event |
| POST | `/api/attendance/mark` | Admin | `{ eventId, entries: [{ volunteerId, present, hours? }] }` |

### Stats
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/stats/summary` | Admin | Dashboard summary cards |
| GET | `/api/stats/monthly-events` | Admin | Monthly events chart |
| GET | `/api/stats/department-volunteers` | Admin | Department-wise pie chart |
| GET | `/api/stats/attendance-trend` | Admin | Attendance trend line chart |
| GET | `/api/stats/announcements` | Public | Homepage "Latest Announcements" |

## 6. Notes

- Passwords are stored as BCrypt hashes; JWTs are stateless (no server-side session).
- File uploads are stored on local disk under `UPLOAD_DIR` (default `./uploads`) — mount a
  persistent volume there in production, or swap `FileStorageService` for S3/Cloud Storage.
- CORS is locked down to `CORS_ALLOWED_ORIGINS` — update this to your deployed frontend URL.
