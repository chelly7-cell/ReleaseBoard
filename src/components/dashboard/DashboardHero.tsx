"use client";

import Link from "next/link";
import { Plus, Terminal, Boxes, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { UserProfile, StatsData } from "./types";

export default function DashboardHero({
  user,
  stats,
}: {
  user: UserProfile | null;
  stats: StatsData;
}) {
  const firstName = user?.name?.split(" ")[0] || "Developer";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[linear-gradient(180deg,#222833_0%,#1B2028_100%)] p-10 lg:p-12">
      {/* Background Glow */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-teal-400 backdrop-blur">
            <Terminal className="h-4 w-4" />
            <span>ReleaseBoard Status • All systems operational</span>
          </div>

          <h1 className="text-5xl font-black tracking-[-0.04em] text-white">
            Welcome back,{" "}
            <span className="text-teal-400">{firstName}</span>
            <span className="ml-2">👋</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            You currently have{" "}
            <span className="font-semibold text-white">
              {stats.published}
            </span>{" "}
            live releases across{" "}
            <span className="font-semibold text-white">
              {stats.applications}
            </span>{" "}
            applications. Monitor performance, publish updates, and keep your
            users informed.
          </p>

          {/* Mini Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
              <Boxes className="h-5 w-5 text-teal-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.applications}
                </p>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Applications
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
              <FileText className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.updates}
                </p>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
              <Eye className="h-5 w-5 text-violet-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {stats.views}
                </p>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Views
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-5">
          <Avatar className="h-16 w-16 rounded-2xl border border-white/10">
            <AvatarImage src={user?.image || undefined} alt={user?.name} />
            <AvatarFallback className="rounded-2xl bg-zinc-800 text-lg font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-7 text-sm font-semibold text-black shadow-lg shadow-teal-500/20 transition-all hover:scale-105 hover:from-teal-300 hover:to-cyan-300"
          >
            <Link href="/updates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Update
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}