"use client";

import Link from "next/link";
import { Plus, Layers, BarChart3, LucideIcon } from "lucide-react";

type Action = {
  title: string;
  command: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const ACTIONS: Action[] = [
  {
    title: "Create update",
    command: "releaseboard new",
    description: "Publish a new release note",
    href: "applications/updates/new",
    icon: Plus,
  },
  {
    title: "Applications",
    command: "releaseboard apps",
    description: "Manage the products you track",
    href: "/applications",
    icon: Layers,
  },
  {
    title: "Analytics",
    command: "releaseboard stats",
    description: "See how readers engage",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function QuickActions() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-xl border border-[#E3E5E0] bg-white p-5 transition hover:border-[#0B6E64]/40 hover:bg-[#0B6E64]/[0.03] dark:border-[#2A2E35] dark:bg-[#15181D] dark:hover:border-[#2DD4BF]/40 dark:hover:bg-[#2DD4BF]/[0.05]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E3E5E0] bg-[#F3F4F1] text-[#12151A] transition group-hover:border-[#0B6E64]/30 group-hover:text-[#0B6E64] dark:border-[#2A2E35] dark:bg-[#1D2127] dark:text-[#F3F4F1] dark:group-hover:border-[#2DD4BF]/30 dark:group-hover:text-[#2DD4BF]">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-mono text-[11px] text-[#5B6472] dark:text-[#9CA3AF]">{action.command}</span>
            </div>
            <h4 className="mt-4 text-sm font-semibold text-[#12151A] dark:text-[#F3F4F1]">{action.title}</h4>
            <p className="mt-1 text-xs text-[#5B6472] dark:text-[#9CA3AF]">{action.description}</p>
          </Link>
        );
      })}
    </section>
  );
}