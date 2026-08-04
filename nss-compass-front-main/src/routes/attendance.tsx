import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Loader2, CheckCircle2, XCircle, UserX } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceApi, ApiError, type AttendanceRecord, type Volunteer } from "@/lib/api";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Tracker — MITS NSS Portal" },
      { name: "description", content: "Track your NSS attendance, service hours, and certificates by roll number." },
      { property: "og:title", content: "Attendance Tracker — MITS NSS Portal" },
      { property: "og:description", content: "Look up your NSS event attendance and service hours instantly." },
    ],
  }),
  component: AttendancePage,
});

const schema = z.object({
  rollNo: z.string().trim().min(6, "Enter a valid roll number").max(20),
});
type FormValues = z.infer<typeof schema>;

function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ volunteer: Volunteer; records: AttendanceRecord[] } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { rollNo: "" } });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setResult(null);
    setNotFound(false);
    try {
      const res = await attendanceApi.lookup(values.rollNo.trim());
      setResult(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const attended = result?.records.filter((r) => r.present).length ?? 0;
  const total = result?.records.length ?? 0;
  const percent = total ? Math.round((attended / total) * 100) : 0;
  const hours = result?.records.reduce((sum, r) => sum + r.hours, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section
        className="relative py-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(198,40,40,0.9), rgba(13,71,161,0.9)), url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1800')",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto max-w-xl px-4">
          <Card className="glass border-white/40 shadow-2xl">
            <CardContent className="p-8">
              <h1 className="text-center font-display text-2xl font-bold text-foreground">
                Attendance Tracker
              </h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Enter your roll number to view your NSS attendance record.
              </p>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input id="rollNo" placeholder="e.g. 22J41A1000" {...form.register("rollNo")} />
                  {form.formState.errors.rollNo && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.rollNo.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full gradient-brand text-white" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  {loading ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {notFound && (
        <section className="mx-auto max-w-xl px-4 py-14 text-center">
          <UserX className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 font-display text-xl font-bold">No record found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't find a volunteer with that roll number. Please check and try again.
          </p>
        </section>
      )}

      {result && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold">{result.volunteer.name}</h2>
              <p className="text-sm text-muted-foreground">
                {result.volunteer.rollNo} · {result.volunteer.department} · Year {result.volunteer.year}
              </p>
            </div>
            <span
              className={
                percent >= 75
                  ? "rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700"
                  : "rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive"
              }
            >
              {percent >= 75 ? "Eligible for certificate" : "Below 75% attendance"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Events Attended" value={`${attended} / ${total}`} />
            <StatCard label="Service Hours" value={String(hours)} />
            <div className="rounded-xl border-none bg-card p-5 shadow-md">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Attendance</p>
              <p className="mt-1 text-2xl font-bold">{percent}%</p>
              <Progress value={percent} className="mt-3" />
            </div>
          </div>

          <Card className="mt-6 border-none shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.records.map((r) => (
                      <TableRow key={r.event}>
                        <TableCell className="font-medium">{r.event}</TableCell>
                        <TableCell className="text-muted-foreground">{r.category}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          {r.present ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" /> Present
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive">
                              <XCircle className="h-4 w-4" /> Absent
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{r.hours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-md">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
