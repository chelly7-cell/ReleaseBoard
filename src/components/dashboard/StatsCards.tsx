"use client";

import { Layers, Rocket, Eye, CheckCircle2, LucideIcon } from "lucide-react";
import type { StatsData } from "./types";

type StatConfig = {
  key: keyof StatsData;
  label: string;
  hint: string;
  icon: LucideIcon;
  accent: string; // hex
};

const CONFIG: StatConfig[] = [
  { key: "applications", label: "Applications", hint: "products tracked", icon: Layers, accent: "#0B6E64" },
  { key: "updates", label: "Updates", hint: "release notes written", icon: Rocket, accent: "#B45309" },
  { key: "views", label: "Views", hint: "total reader visits", icon: Eye, accent: "#2563EB" },
  { key: "published", label: "Published", hint: "live right now", icon: CheckCircle2, accent: "#15803D" },
];

export default function StatsCards({
  stats,
  loading,
}: {
  stats: StatsData;
  loading?: boolean;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CONFIG.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        return (
          <div
            key={item.key}
            className="relative overflow-hidden rounded-xl border border-[#E3E5E0] bg-white pl-5 pr-4 py-4 dark:border-[#2A2E35] dark:bg-[#15181D]"
          >
            
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-[#5B6472] dark:text-[#9CA3AF]">
                {item.label}
              </span>
              <Icon className="h-4 w-4 text-[#5B6472] dark:text-[#9CA3AF]" strokeWidth={1.75} />
            </div>

            <div className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[#12151A] dark:text-[#F3F4F1]">
              {loading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-[#E9EBE5] dark:bg-[#2A2E35]" />
              ) : (
                value.toLocaleString()
              )}
            </div>

            <p className="mt-1 text-xs text-[#5B6472] dark:text-[#9CA3AF]">{item.hint}</p>
          </div>
        );
      })}
    </section>
  );
}