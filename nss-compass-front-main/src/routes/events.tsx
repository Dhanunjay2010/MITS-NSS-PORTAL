import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search, Users, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { eventApi, resolveMediaUrl, type NssEvent } from "@/lib/api";

const EVENT_CATEGORIES = ["Health", "Environment", "Education", "Awareness", "Community Service", "Celebration"];

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Activities — MITS NSS Portal" },
      { name: "description", content: "Browse all events and activities organized by the MITS NSS Unit." },
      { property: "og:title", content: "Events & Activities — MITS NSS Portal" },
      { property: "og:description", content: "Blood donation camps, plantation drives, rallies and more from the MITS NSS Unit." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [count, setCount] = useState(9);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<NssEvent | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventApi.list,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.shortDescription.toLowerCase().includes(q);
      const matchesCat = category === "All" || e.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  const visible = filtered.slice(0, count);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-brand py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Events & Activities</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/85">
            Discover the impactful events organised by our NSS volunteers throughout the year.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCount(9);
              }}
              placeholder="Search events, venues..."
              className="pl-9"
              aria-label="Search events"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...EVENT_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setCount(9);
                }}
                className={
                  c === category
                    ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
                    : "rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {isLoading ? "Loading events..." : `Showing ${visible.length} of ${filtered.length} events`}
        </p>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 9) * 0.05 }}
            >
              <Card className="group h-full overflow-hidden border-none shadow-md transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={resolveMediaUrl(e.bannerUrl)}
                    alt={`${e.title} at ${e.venue}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute left-3 top-3 bg-accent text-accent-foreground">{e.category}</Badge>
                </div>
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold">{e.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {e.date}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.venue}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {e.participants}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{e.shortDescription}</p>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => setSelected(e)}>Read More</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">No events match your search.</p>
        )}

        {count < filtered.length && (
          <div className="mt-10 flex justify-center">
            <Button size="lg" onClick={() => setCount((c) => c + 6)}>Load More</Button>
          </div>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <img src={resolveMediaUrl(selected.bannerUrl)} alt={selected.title} className="h-56 w-full rounded-md object-cover" />
              <DialogHeader>
                <DialogTitle className="text-2xl">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary">{selected.category}</Badge>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {selected.date}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {selected.venue}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {selected.participants} participants</span>
              </div>
              <p className="text-sm">{selected.description}</p>
              {selected.gallery.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selected.gallery.map((g, idx) => (
                      <img
                        key={`${selected.id}-${idx}`}
                        src={resolveMediaUrl(g)}
                        alt={`${selected.title} photo ${idx + 1}`}
                        loading="lazy"
                        className="h-24 w-full rounded-md object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
