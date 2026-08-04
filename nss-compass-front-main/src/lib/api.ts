// Central API client for the MITS NSS Portal backend (Spring Boot).
// Base URL is configurable via VITE_API_URL (see .env.example).

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "nss_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  isForm?: boolean;
  auth?: boolean; // attach Authorization header (default: true)
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, isForm = false, auth = true } = options;

  const headers: Record<string, string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch {
      // response wasn't JSON — keep default message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return undefined as T;
  return res.json() as Promise<T>;
}

export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

// ---------- Types ----------

export type Volunteer = {
  id: number;
  rollNo: string;
  name: string;
  department: string;
  year: 1 | 2 | 3 | 4;
  phone: string;
  gender: "Male" | "Female";
  email: string;
  bloodGroup: string;
  address: string;
  hours: number;
  status: "Active" | "Inactive";
};

export type VolunteerPage = {
  content: Volunteer[];
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-indexed
  size: number;
};

export type NssEvent = {
  id: number;
  title: string;
  date: string;
  time?: string;
  venue: string;
  category: string;
  participants: number;
  collaboration?: string;
  description: string;
  achievements?: string;
  chiefGuest?: string;
  programOfficer?: string;
  officialStaff?: string;
  bannerUrl?: string;
  reportUrl?: string;
  gallery: string[];
  shortDescription: string;
};

export type AttendanceRecord = {
  event: string;
  category: string;
  date: string;
  present: boolean;
  hours: number;
};

export type AttendanceLookupResponse = {
  volunteer: Volunteer;
  records: AttendanceRecord[];
};

export type StatsSummary = {
  totalEvents: number;
  eventsThisYear: number;
  totalVolunteers: number;
  attendancePercent: number;
};

export type NamedValue = { name: string; value: number };
export type MonthlyValue = { month: string; value: number };

export type Announcement = {
  id: number;
  tag: string;
  title: string;
  date: string;
  body: string;
};

export type LoginResponse = { token: string; email: string; name: string };

// ---------- Auth ----------

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/auth/login", { method: "POST", body: { email, password }, auth: false }),
};

// ---------- Volunteers ----------

export type VolunteerQuery = {
  query?: string;
  department?: string;
  year?: number;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  size?: number;
};

export const volunteerApi = {
  list: (params: VolunteerQuery = {}) => {
    const search = new URLSearchParams();
    if (params.query) search.set("query", params.query);
    if (params.department) search.set("department", params.department);
    if (params.year) search.set("year", String(params.year));
    if (params.sortKey) search.set("sortKey", params.sortKey);
    if (params.sortDir) search.set("sortDir", params.sortDir);
    search.set("page", String(params.page ?? 1));
    search.set("size", String(params.size ?? 10));
    return request<VolunteerPage>(`/api/volunteers?${search.toString()}`);
  },
  getByRollNo: (rollNo: string) => request<Volunteer>(`/api/volunteers/by-roll/${encodeURIComponent(rollNo)}`, { auth: false }),
  create: (v: Omit<Volunteer, "id">) => request<Volunteer>("/api/volunteers", { method: "POST", body: v }),
  update: (id: number, v: Omit<Volunteer, "id">) => request<Volunteer>(`/api/volunteers/${id}`, { method: "PUT", body: v }),
  remove: (id: number) => request<void>(`/api/volunteers/${id}`, { method: "DELETE" }),
};

// ---------- Events ----------

export type EventFormValues = {
  title: string;
  date: string;
  time?: string;
  venue?: string;
  category?: string;
  participants?: number;
  collaboration?: string;
  description?: string;
  achievements?: string;
  chiefGuest?: string;
  programOfficer?: string;
  officialStaff?: string;
  banner?: File | null;
  report?: File | null;
  images?: File[];
};

function buildEventFormData(values: EventFormValues): FormData {
  const fd = new FormData();
  fd.set("title", values.title);
  fd.set("date", values.date);
  if (values.time) fd.set("time", values.time);
  if (values.venue) fd.set("venue", values.venue);
  if (values.category) fd.set("category", values.category);
  if (values.participants !== undefined) fd.set("participants", String(values.participants));
  if (values.collaboration) fd.set("collaboration", values.collaboration);
  if (values.description) fd.set("description", values.description);
  if (values.achievements) fd.set("achievements", values.achievements);
  if (values.chiefGuest) fd.set("chiefGuest", values.chiefGuest);
  if (values.programOfficer) fd.set("programOfficer", values.programOfficer);
  if (values.officialStaff) fd.set("officialStaff", values.officialStaff);
  if (values.banner) fd.set("banner", values.banner);
  if (values.report) fd.set("report", values.report);
  if (values.images) values.images.forEach((img) => fd.append("images", img));
  return fd;
}

export const eventApi = {
  list: () => request<NssEvent[]>("/api/events", { auth: false }),
  getById: (id: number) => request<NssEvent>(`/api/events/${id}`, { auth: false }),
  create: (values: EventFormValues) =>
    request<NssEvent>("/api/events", { method: "POST", body: buildEventFormData(values), isForm: true }),
  update: (id: number, values: EventFormValues) =>
    request<NssEvent>(`/api/events/${id}`, { method: "PUT", body: buildEventFormData(values), isForm: true }),
  remove: (id: number) => request<void>(`/api/events/${id}`, { method: "DELETE" }),
};

// ---------- Attendance ----------

export const attendanceApi = {
  lookup: (rollNo: string) =>
    request<AttendanceLookupResponse>(`/api/attendance/lookup?rollNo=${encodeURIComponent(rollNo)}`, { auth: false }),
  byEvent: (eventId: number) => request<AttendanceRecord[]>(`/api/attendance/event/${eventId}`),
  mark: (eventId: number, entries: { volunteerId: number; present: boolean; hours?: number }[]) =>
    request<void>("/api/attendance/mark", { method: "POST", body: { eventId, entries } }),
};

// ---------- Stats ----------

export const statsApi = {
  summary: () => request<StatsSummary>("/api/stats/summary"),
  monthlyEvents: () => request<MonthlyValue[]>("/api/stats/monthly-events"),
  departmentVolunteers: () => request<NamedValue[]>("/api/stats/department-volunteers"),
  attendanceTrend: () => request<MonthlyValue[]>("/api/stats/attendance-trend"),
  announcements: () => request<Announcement[]>("/api/stats/announcements", { auth: false }),
};
