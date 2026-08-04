import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Percent, Trophy, Loader2 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsApi } from "@/lib/api";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — MITS NSS Portal" },
      { name: "description", content: "Overview of NSS events, volunteers and attendance analytics." },
    ],
  }),
  component: DashboardHome,
});


const PIE_COLORS = ["#C62828", "#0D47A1", "#2E7D32", "#F9A825", "#6A1B9A", "#00838F", "#EF6C00", "#4E342E"];

function DashboardHome() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["stats", "summary"],
    queryFn: statsApi.summary,
  });
  const { data: monthlyEvents = [], isLoading: loadingMonthly } = useQuery({
    queryKey: ["stats", "monthly-events"],
    queryFn: statsApi.monthlyEvents,
  });
  const { data: departmentVolunteers = [], isLoading: loadingDept } = useQuery({
    queryKey: ["stats", "department-volunteers"],
    queryFn: statsApi.departmentVolunteers,
  });
  const { data: attendanceTrend = [], isLoading: loadingTrend } = useQuery({
    queryKey: ["stats", "attendance-trend"],
    queryFn: statsApi.attendanceTrend,
  });

  const cards = [
    { label: "Total Events", value: summary?.totalEvents ?? "—", icon: CalendarDays, tint: "bg-primary/10 text-primary" },
    { label: "This Academic Year", value: summary?.eventsThisYear ?? "—", icon: Trophy, tint: "bg-accent/10 text-accent" },
    { label: "Total Volunteers", value: summary?.totalVolunteers ?? "—", icon: Users, tint: "bg-emerald-100 text-emerald-700" },
    { label: "Attendance", value: summary ? `${summary.attendancePercent}%` : "—", icon: Percent, tint: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of NSS activities and volunteer engagement.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-none shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tint}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="font-display text-2xl font-bold">
                  {loadingSummary ? <Loader2 className="h-5 w-5 animate-spin" /> : c.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle>Monthly Events</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loadingMonthly ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEvents}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Events" fill="#C62828" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle>Attendance Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loadingTrend ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" name="Attendance %" stroke="#0D47A1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md lg:col-span-2">
          <CardHeader><CardTitle>Department-wise Volunteers</CardTitle></CardHeader>
          <CardContent className="h-80">
            {loadingDept ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentVolunteers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    {departmentVolunteers.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
