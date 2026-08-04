import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/attendance", label: "Attendance" },
  { to: "/login", label: "Login" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: logos */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-brand text-white shadow-md">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">NSS</div>
            <div className="truncate text-[11px] text-muted-foreground">Not Me But You</div>
          </div>
          <div className="ml-2 hidden h-10 w-px bg-border md:block" />
          <div className="hidden text-xs font-semibold uppercase tracking-wider text-accent md:block">
            MITS
          </div>
        </div>

        {/* Center title */}
        <Link
          to="/"
          className="hidden text-center font-display text-lg font-bold tracking-tight text-foreground md:block lg:text-xl"
        >
          MITS NSS PORTAL
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  active ? "text-primary" : "text-foreground/80",
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col p-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  pathname === l.to ? "bg-primary/10 text-primary" : "text-foreground",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
