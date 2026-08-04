import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { clearToken, getToken } from "@/lib/api";
import {
  LayoutDashboard, CalendarPlus, Users, ClipboardCheck, LogOut,
  Bell, Search, HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — MITS NSS Portal" },
      { name: "description", content: "Manage events, volunteers, and attendance for MITS NSS." },
    ],
  }),
  component: DashboardLayout,
});

const menu: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/events", label: "Add Events", icon: CalendarPlus },
  { to: "/dashboard/volunteers", label: "Volunteers", icon: Users },
  { to: "/dashboard/attendance", label: "Mark Attendance", icon: ClipboardCheck },
];

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const handleLogout = () => {
    clearToken();
    toast.success("Logged out");
    setTimeout(() => navigate({ to: "/" }), 300);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-brand text-white">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="text-sm font-bold text-white">MITS NSS</div>
                <div className="truncate text-[10px] text-white/60">Admin Console</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu.map((m) => (
                    <SidebarMenuItem key={m.to}>
                      <SidebarMenuButton asChild isActive={isActive(m.to, m.exact)} tooltip={m.label}>
                        <Link to={m.to} className="flex items-center gap-2">
                          <m.icon className="h-4 w-4" />
                          <span>{m.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white px-4 shadow-sm">
            <SidebarTrigger />
            <div className={cn("hidden text-sm font-medium md:block")}>Welcome, Admin</div>
            <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="gradient-brand text-white">A</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
