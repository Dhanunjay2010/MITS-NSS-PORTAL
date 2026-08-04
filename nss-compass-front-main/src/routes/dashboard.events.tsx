import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventApi, ApiError } from "@/lib/api";

export const Route = createFileRoute("/dashboard/events")({
  head: () => ({
    meta: [
      { title: "Add Event — MITS NSS Admin" },
      { name: "description", content: "Create a new NSS event with banner, gallery and report uploads." },
    ],
  }),
  component: AddEventPage,
});


const schema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().trim().min(2, "Venue is required"),
  collaboration: z.string().optional(),
  description: z.string().trim().min(10, "Add a longer description"),
  chiefGuest: z.string().trim().min(2, "Required"),
  programOfficer: z.string().trim().min(2, "Required"),
  officialStaff: z.string().trim().min(2, "Required"),
  achievements: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function AddEventPage() {
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [report, setReport] = useState<File | null>(null);
  const [reportName, setReportName] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", date: "", time: "", venue: "", collaboration: "",
      description: "", chiefGuest: "", programOfficer: "", officialStaff: "", achievements: "",
    },
  });

  const resetAll = () => {
    form.reset();
    setBanner(null);
    setBannerPreview(null);
    setReport(null);
    setReportName(null);
    setImages([]);
    setImagePreviews([]);
  };

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      eventApi.create({
        ...values,
        banner,
        report,
        images,
      }),
    onSuccess: () => {
      toast.success("Event saved successfully");
      resetAll();
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to save event");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const onReset = () => {
    resetAll();
    toast.info("Form cleared");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Add Event / Activity</h1>
        <p className="text-sm text-muted-foreground">Register a new NSS event with full details.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Event Title" error={form.formState.errors.title?.message}>
              <Input {...form.register("title")} placeholder="Blood Donation Camp" />
            </Field>
            <Field label="Collaboration (Optional)">
              <Input {...form.register("collaboration")} placeholder="Red Cross Society" />
            </Field>
            <Field label="Date" error={form.formState.errors.date?.message}>
              <Input type="date" {...form.register("date")} />
            </Field>
            <Field label="Time" error={form.formState.errors.time?.message}>
              <Input type="time" {...form.register("time")} />
            </Field>
            <Field label="Venue" error={form.formState.errors.venue?.message}>
              <Input {...form.register("venue")} placeholder="MITS Auditorium" />
            </Field>
            <Field label="Chief Guest" error={form.formState.errors.chiefGuest?.message}>
              <Input {...form.register("chiefGuest")} />
            </Field>
            <Field label="NSS Program Officer" error={form.formState.errors.programOfficer?.message}>
              <Input {...form.register("programOfficer")} />
            </Field>
            <Field label="Official Staff" error={form.formState.errors.officialStaff?.message}>
              <Input {...form.register("officialStaff")} />
            </Field>
            <Field label="Description" error={form.formState.errors.description?.message} span2>
              <Textarea rows={4} {...form.register("description")} placeholder="Brief about the event..." />
            </Field>
            <Field label="Achievements" span2>
              <Textarea rows={3} {...form.register("achievements")} placeholder="Key outcomes and highlights..." />
            </Field>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle>Uploads</CardTitle></CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-3">
            <div>
              <Label>Event Banner</Label>
              <label className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="banner" className="h-full w-full rounded-md object-cover" />
                ) : (
                  <>
                    <UploadCloud className="h-6 w-6" />
                    <span>Click to upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setBanner(f);
                      setBannerPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <Label>Event Report (PDF)</Label>
              <label className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted">
                <UploadCloud className="h-6 w-6" />
                <span>{reportName ?? "Upload PDF"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setReport(f);
                    setReportName(f?.name ?? null);
                  }}
                />
              </label>
            </div>

            <div>
              <Label>Event Images</Label>
              <label className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-sm text-muted-foreground hover:bg-muted">
                <UploadCloud className="h-6 w-6" />
                <span>Upload multiple</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    setImages((prev) => [...prev, ...files]);
                    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
                  }}
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="h-16 w-full rounded object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImages((prev) => prev.filter((_, j) => j !== i));
                          setImagePreviews((prev) => prev.filter((_, j) => j !== i));
                        }}
                        className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="gradient-brand text-white" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Submit"}
          </Button>
          <Button type="button" variant="outline" onClick={onReset} disabled={mutation.isPending}>Reset</Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, children, error, span2,
}: { label: string; children: React.ReactNode; error?: string; span2?: boolean }) {
  return (
    <div className={span2 ? "md:col-span-2" : ""}>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
