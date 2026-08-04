import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Search, Save, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { eventApi, volunteerApi, attendanceApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({
    meta: [
      { title: "Mark Attendance — MITS NSS Admin" },
      { name: "description", content: "Mark volunteer attendance for any NSS event." },
    ],
  }),
  component: MarkAttendancePage,
});

const DEPARTMENTS = ["CSE", "CSM", "CSBS", "ECE", "EEE", "MECH", "CIVIL", "MBA"];

function MarkAttendancePage() {
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState<string>("");
  const [attendance, setAttendance] = useState<Record<number, "P" | "A" | undefined>>({});
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [year, setYear] = useState("all");

  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: eventApi.list,
  });

  const { data: volunteerPage, isLoading: loadingVolunteers } = useQuery({
    queryKey: ["volunteers", "mark-attendance", query, dept, year],
    queryFn: () =>
      volunteerApi.list({
        query: query.trim() || undefined,
        department: dept === "all" ? undefined : dept,
        year: year === "all" ? undefined : Number(year),
        page: 1,
        size: 500, // large page — this view needs the full filtered roster, not paginated
      }),
    enabled: !!eventId,
  });

  const rows = volunteerPage?.content ?? [];

  const setMark = (id: number, mark: "P" | "A") =>
    setAttendance((a) => ({ ...a, [id]: a[id] === mark ? undefined : mark }));

  const markedCount = useMemo(() => Object.values(attendance).filter(Boolean).length, [attendance]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const entries = Object.entries(attendance)
        .filter(([, mark]) => mark !== undefined)
        .map(([volunteerId, mark]) => ({
          volunteerId: Number(volunteerId),
          present: mark === "P",
        }));
      return attendanceApi.mark(Number(eventId), entries);
    },
    onSuccess: () => {
      toast.success("Attendance saved");
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to save attendance");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">Select an event and mark volunteer attendance.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[280px] flex-1">
              <Label>Select Event</Label>
              <Select value={eventId} onValueChange={(v) => { setEventId(v); setAttendance({}); }}>
                <SelectTrigger><SelectValue placeholder="Choose event..." /></SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.title} — {e.date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative min-w-[220px] flex-1">
              <Label>Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or roll..." className="pl-9" />
              </div>
            </div>
            <div className="w-36">
              <Label>Department</Label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28">
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {[1, 2, 3, 4].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {eventId ? (
        <Card className="border-none shadow-md">
          <CardContent className="p-0">
            <div className="max-h-[560px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                  <TableRow>
                    <TableHead className="w-12">S.No</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingVolunteers && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!loadingVolunteers && rows.map((v, i) => {
                    const mark = attendance[v.id];
                    return (
                      <TableRow key={v.id} className="hover:bg-muted/40">
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{v.rollNo}</TableCell>
                        <TableCell>{v.name}</TableCell>
                        <TableCell>{v.department}</TableCell>
                        <TableCell>{v.year}</TableCell>
                        <TableCell>{v.phone}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setMark(v.id, "P")}
                              className={cn(
                                "grid h-8 w-8 place-items-center rounded-md border transition",
                                mark === "P" ? "bg-emerald-500 text-white border-emerald-500" : "border-border text-emerald-600 hover:bg-emerald-50",
                              )}
                              aria-label="Present"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setMark(v.id, "A")}
                              className={cn(
                                "grid h-8 w-8 place-items-center rounded-md border transition",
                                mark === "A" ? "bg-destructive text-white border-destructive" : "border-border text-destructive hover:bg-destructive/10",
                              )}
                              aria-label="Absent"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {!loadingVolunteers && rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No volunteers match your filters.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Select an event above to begin marking attendance.
          </CardContent>
        </Card>
      )}

      {eventId && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="gradient-brand text-white"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || markedCount === 0}
          >
            <Save className="mr-1 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : `Save Attendance (${markedCount})`}
          </Button>
          <Button variant="outline" onClick={() => { setAttendance({}); toast.info("Attendance reset"); }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </div>
      )}
    </div>
  );
}
