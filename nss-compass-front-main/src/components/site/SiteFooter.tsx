import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold text-white">MITS NSS Portal</div>
          <p className="mt-3 text-sm text-white/70">
            Not Me But You — Serving the community through the National Service Scheme.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-primary transition"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="font-semibold text-white">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/attendance" className="hover:text-white">Attendance</Link></li>
            <li><Link to="/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-white">NSS Unit</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>Programme Officer</li>
            <li>Student Volunteers</li>
            <li>Adopted Village Programs</li>
            <li>Annual Reports</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-white">Contact</div>
          <ul className="mt-3 space-y-3 text-sm text-white/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /> MITS, Madanapalle, Andhra Pradesh — 517325</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 mt-0.5" /> nss@mits.ac.in</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5" /> +91 8571 220 137</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} MITS NSS Unit. All rights reserved.
      </div>
    </footer>
  );
}
