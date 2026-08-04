import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { authApi, setToken, ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — MITS NSS Portal" },
      { name: "description", content: "Sign in to the MITS NSS admin dashboard." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", remember: false } });

  const [loading, setLoadingState] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoadingState(true);
    try {
      const res = await authApi.login(values.email, values.password);
      setToken(res.token);
      toast.success(`Welcome back, ${res.name}!`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section
        className="relative py-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(198,40,40,0.85), rgba(13,71,161,0.85)), url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1800')",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto max-w-md px-4">
          <Card className="glass border-white/40 shadow-2xl">
            <CardContent className="p-8">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-brand text-white shadow-lg">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-center font-display text-2xl font-bold">Admin Login</h1>
              <p className="text-center text-sm text-muted-foreground">Sign in to manage NSS operations.</p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="email">Email / Username</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" className="pl-9" placeholder="admin@mits.ac.in" {...form.register("email")} />
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={show ? "text" : "password"}
                      className="pl-9 pr-10"
                      placeholder="••••••••"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle password"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox onCheckedChange={(v) => form.setValue("remember", !!v)} /> Remember me
                  </label>
                  <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full gradient-brand text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Not an admin? <Link to="/" className="text-primary hover:underline">Return home</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
