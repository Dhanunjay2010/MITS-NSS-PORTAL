import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, Search, Upload, Download, Pencil, Trash2, Eye,
  ArrowUpDown, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { volunteerApi, ApiError, type Volunteer } from "@/lib/api";

export const Route = createFileRoute("/dashboard/volunteers")({
  head: () => ({
    meta: [
      { title: "Manage Volunteers — MITS NSS Admin" },
      { name: "description", content: "Add, edit, filter and manage MITS NSS volunteer records." },
    ],
  }),
  component: VolunteersPage,
});

const DEPARTMENTS = ["CSE", "CSM", "CSBS", "ECE", "EEE", "MECH", "CIVIL", "MBA"];

type SortKey = "rollNo" | "name" | "department" | "year" | "hours";

function VolunteersPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [creating, setCreating] = useState(false);
  const [viewing, setViewing] = useState<Volunteer | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [query, dept, year, sort]);

  const listParams = {
    query: query.trim() || undefined,
    department: dept === "all" ? undefined : dept,
    year: year === "all" ? undefined : Number(year),
    sortKey: sort.key,
    sortDir: sort.dir,
    page,
    size: pageSize,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["volunteers", listParams],
    queryFn: () => volunteerApi.list(listParams),
  });

  const rows = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["volunteers"] });

  const createMutation = useMutation({
    mutationFn: (v: Omit<Volunteer, "id">) => volunteerApi.create(v),
    onSuccess: () => { toast.success("Volunteer added"); invalidate(); setCreating(false); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to add volunteer"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, v }: { id: number; v: Omit<Volunteer, "id"> }) => volunteerApi.update(id, v),
    onSuccess: () => { toast.success("Volunteer updated"); invalidate(); setEditing(null); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update volunteer"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => volunteerApi.remove(id),
    onSuccess: () => { toast.success("Volunteer deleted"); invalidate(); setDeleteId(null); },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to delete volunteer"),
  });

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));

  const onSave = (v: Volunteer) => {
    const { id, ...rest } = v;
    if (editing) updateMutation.mutate({ id: editing.id, v: rest });
    else createMutation.mutate(rest);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Volunteers</h1>
          <p className="text-sm text-muted-foreground">{totalElements} volunteers found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setCreating(true)} className="gradient-brand text-white">
            <Plus className="mr-1 h-4 w-4" /> Add Volunteer
          </Button>
          <Button variant="outline" onClick={() => toast.info("Import Excel — coming soon")}>
            <Upload className="mr-1 h-4 w-4" /> Import
          </Button>
          <Button variant="outline" onClick={() => toast.info("Export Excel — coming soon")}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, roll, phone" className="pl-9" />
            </div>
            <div className="w-40">
              <Label className="text-xs">Department</Label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Label className="text-xs">Year</Label>
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

      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S.No</TableHead>
                  <SortHead label="Roll No" onClick={() => toggleSort("rollNo")} />
                  <SortHead label="Name" onClick={() => toggleSort("name")} />
                  <SortHead label="Department" onClick={() => toggleSort("department")} />
                  <SortHead label="Year" onClick={() => toggleSort("year")} />
                  <TableHead>Phone</TableHead>
                  <SortHead label="Hours" onClick={() => toggleSort("hours")} />
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading || isFetching) && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !isFetching && rows.map((v, i) => (
                  <TableRow key={v.id} className="hover:bg-muted/50">
                    <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                    <TableCell className="font-medium">{v.rollNo}</TableCell>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.department}</TableCell>
                    <TableCell>{v.year}</TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell>{v.hours}</TableCell>
                    <TableCell>
                      <span
                        className={
                          v.status === "Active"
                            ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {v.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => setViewing(v)} aria-label="View"><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(v)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(v.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && !isFetching && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No volunteers match your filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
            <div className="text-muted-foreground">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <VolunteerForm
        open={creating || !!editing}
        volunteer={editing}
        saving={createMutation.isPending || updateMutation.isPending}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSave={onSave}
      />

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>{viewing.rollNo} · {viewing.department} · Year {viewing.year}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 text-sm">
                <div><span className="text-muted-foreground">Phone:</span> {viewing.phone}</div>
                <div><span className="text-muted-foreground">Email:</span> {viewing.email}</div>
                <div><span className="text-muted-foreground">Gender:</span> {viewing.gender}</div>
                <div><span className="text-muted-foreground">Blood Group:</span> {viewing.bloodGroup}</div>
                <div><span className="text-muted-foreground">Service Hours:</span> {viewing.hours}</div>
                <div><span className="text-muted-foreground">Status:</span> {viewing.status}</div>
                <div><span className="text-muted-foreground">Address:</span> {viewing.address}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this volunteer?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SortHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <TableHead>
      <button onClick={onClick} className="inline-flex items-center gap-1 font-medium hover:text-primary">
        {label} <ArrowUpDown className="h-3.5 w-3.5" />
      </button>
    </TableHead>
  );
}

const emptyVolunteer: Volunteer = {
  id: 0, rollNo: "", name: "", department: "CSE", year: 1,
  phone: "", gender: "Male", email: "", bloodGroup: "O+", address: "",
  hours: 0, status: "Active",
};

function VolunteerForm({
  open, volunteer, saving, onClose, onSave,
}: {
  open: boolean;
  volunteer: Volunteer | null;
  saving: boolean;
  onClose: () => void;
  onSave: (v: Volunteer) => void;
}) {
  const [v, setV] = useState<Volunteer>(volunteer ?? emptyVolunteer);

  // reset form whenever the target (or open state) changes
  useEffect(() => {
    setV(volunteer ?? emptyVolunteer);
  }, [volunteer, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{volunteer ? "Edit Volunteer" : "Add Volunteer"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Roll Number" value={v.rollNo} onChange={(val) => setV({ ...v, rollNo: val })} />
          <TextField label="Name" value={v.name} onChange={(val) => setV({ ...v, name: val })} />
          <div>
            <Label>Department</Label>
            <Select value={v.department} onValueChange={(val) => setV({ ...v, department: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year</Label>
            <Select value={String(v.year)} onValueChange={(val) => setV({ ...v, year: Number(val) as 1 | 2 | 3 | 4 })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1, 2, 3, 4].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <TextField label="Phone" value={v.phone} onChange={(val) => setV({ ...v, phone: val })} />
          <div>
            <Label>Gender</Label>
            <Select value={v.gender} onValueChange={(val) => setV({ ...v, gender: val as Volunteer["gender"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TextField label="Email" value={v.email} onChange={(val) => setV({ ...v, email: val })} />
          <div>
            <Label>Blood Group</Label>
            <Select value={v.bloodGroup} onValueChange={(val) => setV({ ...v, bloodGroup: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Service Hours</Label>
            <Input
              type="number"
              value={v.hours}
              onChange={(e) => setV({ ...v, hours: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={v.status} onValueChange={(val) => setV({ ...v, status: val as Volunteer["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input value={v.address} onChange={(e) => setV({ ...v, address: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="gradient-brand text-white" onClick={() => onSave(v)} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
