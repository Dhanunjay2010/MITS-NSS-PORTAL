import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Droplet, Trees, Sparkles, Stethoscope, Home as HomeIcon,
  Megaphone, Target, Eye, ListChecks, ChevronLeft, ChevronRight,
  Users, Clock, Award, CalendarDays, ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";

// Decorative gallery images for the homepage carousel (not domain data — no backend needed).
const carouselImages = [
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200",
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=1200",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MITS NSS Portal — Not Me But You" },
      { name: "description", content: "Home of the MITS NSS Unit — activities, events, volunteers, and community service." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Carousel />
      <About />
      <Activities />
      <Stats />
      <Announcements />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(198,40,40,0.85), rgba(13,71,161,0.8)), url('https://images.unsplash.com/photo-1593113630400-ea4288922497?w=1800')",
        }}
      />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge className="bg-white/20 text-white backdrop-blur border-white/30">National Service Scheme</Badge>
          <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            Not Me But You
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
            Empowering student volunteers at MITS to serve society through selfless action, awareness, and community welfare.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/events">Explore Activities <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:bg-white/10">
              <Link to="/login">Volunteer Today</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 3000);
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Moments of Service</h2>
        <p className="mt-2 text-muted-foreground">Glimpses from our NSS activities.</p>
      </div>
      <div className="relative mt-8 overflow-hidden rounded-2xl shadow-xl">
        <div ref={emblaRef}>
          <div className="flex">
            {carouselImages.map((src, i) => (
              <div key={i} className="min-w-0 flex-[0_0_100%]">
                <img src={src} alt={`NSS activity ${i + 1}`} className="h-[280px] w-full object-cover md:h-[440px]" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 shadow hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 shadow hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${selected === i ? "w-8 bg-primary" : "w-2 bg-white/70"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const items = [
    { icon: Target, title: "Mission", body: "To develop the personality of students through community service and instill social consciousness." },
    { icon: Eye, title: "Vision", body: "To build responsible citizens committed to nation-building through selfless service and social welfare." },
    { icon: ListChecks, title: "Objectives", body: "Identify community needs, engage in problem-solving, develop leadership qualities, and promote national integration." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">About NSS</h2>
        <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
          The National Service Scheme (NSS) is a permanent youth programme of the Ministry of Youth Affairs & Sports, aiming to develop student personality through community service.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full border-none shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-white">
                  <it.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Activities() {
  const acts = [
    { icon: Droplet, title: "Blood Donation", desc: "Regular blood donation camps in association with local hospitals.", img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800" },
    { icon: Trees, title: "Tree Plantation", desc: "Greening the campus and neighbouring villages with saplings.", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" },
    { icon: Sparkles, title: "Swachh Bharat", desc: "Community cleanliness drives in adopted areas.", img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800" },
    { icon: Stethoscope, title: "Health Camps", desc: "Free medical check-ups and health awareness drives.", img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800" },
    { icon: HomeIcon, title: "Village Adoption", desc: "Long-term development of adopted rural communities.", img: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800" },
    { icon: Megaphone, title: "Awareness Programs", desc: "Campaigns on literacy, health, environment, and rights.", img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800" },
  ];
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">NSS Activities</h2>
          <p className="mt-3 text-muted-foreground">Key initiatives run by our unit.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {acts.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group h-full overflow-hidden border-none shadow-md transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-44 overflow-hidden">
                  <img src={a.img} alt={a.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-white/90 text-primary shadow">
                    <a.icon className="h-5 w-5" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                  <Link to="/events" className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                    Read more <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Stats() {
  const items = [
    { icon: CalendarDays, value: 100, label: "Events" },
    { icon: Users, value: 1200, label: "Volunteers" },
    { icon: Clock, value: 5000, label: "Service Hours" },
    { icon: Award, value: 40, label: "Awards" },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-brand" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 text-white sm:px-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="text-center">
            <it.icon className="mx-auto h-8 w-8 opacity-90" />
            <div className="mt-3 font-display text-4xl font-extrabold md:text-5xl">
              <Counter end={it.value} />
            </div>
            <div className="mt-1 text-sm uppercase tracking-wider opacity-90">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Announcements() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: statsApi.announcements,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Latest Announcements</h2>
        <p className="mt-2 text-muted-foreground">Stay informed with what's happening at MITS NSS.</p>
      </div>
      {isLoading ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">Loading announcements...</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {announcements.map((a) => (
            <Card key={a.id} className="border-none shadow-md transition hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="p-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary">{a.tag}</Badge>
                <h3 className="mt-3 font-semibold">{a.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{a.date}</p>
                <p className="mt-3 text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
