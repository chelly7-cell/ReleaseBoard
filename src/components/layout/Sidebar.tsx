"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Rocket,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/validations/utils";
import { authClient } from "@/lib/auth-client";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Rocket },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      // redirect after logout
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center shadow-sm rounded-xl bg-primary from-violet-500 to-indigo-600 text-white font-bold">
            R
          </div>

          <div>
            <h2 className="font-semibold">ReleaseBoard</h2>
            <p className="text-xs text-muted-foreground">
              Release Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <p className="mb-3 px-3 text-[11px] tracking-[0.22em] font-semibold uppercase text-muted-foreground">
          MAIN
        </p>

        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "group flex items-center rounded-xl px-3 py-2.5 transition-all duration-200",
                    active
                        ? "bg-primary/10 text-primary border border-primary/10 shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>

                <ChevronRight
                className={cn(
                "h-4 w-4 transition",
                active
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-50"
                )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Pro Card */}
        <div className="mt-8 rounded-xl shadow-sm border p-4">
          <p className="text-xs text-muted-foreground">PRO PLAN</p>

          <h3 className="mt-2 font-semibold">Grow Faster</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage unlimited applications and releases.
          </p>

          <button className="mt-4 w-full rounded-xl border px-3 py-2 text-sm hover:bg-muted">
            Upgrade
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}