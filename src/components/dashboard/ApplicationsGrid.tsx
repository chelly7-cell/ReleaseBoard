"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Application } from "./types";

function monogram(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// deterministic accent from the app name so tiles stay stable across renders
const ACCENTS = ["#0B6E64", "#B45309", "#2563EB", "#7C3AED", "#15803D"];
function accentFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

export default function ApplicationsGrid({
  applications,
  loading,
}: {
  applications: Application[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E3E5E0] bg-white p-6 dark:border-[#2A2E35] dark:bg-[#15181D]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#12151A] dark:text-[#F3F4F1]">Applications</h3>
          <p className="mt-0.5 text-xs text-[#5B6472] dark:text-[#9CA3AF]">what you&apos;re shipping changelogs for</p>
        </div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0B6E64] hover:underline dark:text-[#2DD4BF]"
        >
          view all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-[#F3F4F1] dark:bg-[#1D2127]" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#E3E5E0] py-10 text-center dark:border-[#2A2E35]">
          <p className="text-sm text-[#5B6472] dark:text-[#9CA3AF]">No applications yet. Add one to start publishing.</p>
          <Link
            href="/applications"
            className="mt-2 inline-block text-sm font-medium text-[#0B6E64] hover:underline dark:text-[#2DD4BF]"
          >
            create application
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {applications.map((app) => {
            const accent = accentFor(app.name);
            return (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="group flex items-center gap-3 rounded-lg border border-[#E3E5E0] p-3 transition hover:border-[#0B6E64]/40 hover:bg-[#0B6E64]/[0.03] dark:border-[#2A2E35] dark:hover:border-[#2DD4BF]/40 dark:hover:bg-[#2DD4BF]/[0.05]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-xs font-semibold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {monogram(app.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#12151A] dark:text-[#F3F4F1]">{app.name}</p>
                  <p className="font-mono text-xs text-[#5B6472] dark:text-[#9CA3AF]">
                    {app.updatesCount} update{app.updatesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: app.status === "active" ? "#15803D" : "#8A8F98" }}
                  title={app.status}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}