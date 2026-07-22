"use client";

import type { ActivityItem, UpdateStatus } from "./types";

const STATUS_COLOR: Record<UpdateStatus, { light: string; dark: string }> = {
  published: { light: "#0B6E64", dark: "#2DD4BF" },
  draft: { light: "#B45309", dark: "#F59E0B" },
  archived: { light: "#8A8F98", dark: "#6B7280" },
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ActivityFeed({
  items,
  loading,
}: {
  items: ActivityItem[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E3E5E0] bg-white p-6 dark:border-[#2A2E35] dark:bg-[#15181D]">
      <h3 className="text-sm font-semibold text-[#12151A] dark:text-[#F3F4F1]">Activity log</h3>
      <p className="mt-0.5 text-xs text-[#5B6472] dark:text-[#9CA3AF]">who shipped what, most recent first</p>

      <div className="relative mt-5">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-[#F3F4F1] dark:bg-[#1D2127]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#5B6472] dark:text-[#9CA3AF]">Nothing logged yet.</p>
        ) : (
          <ul className="space-y-5">
            {items.map((item, i) => (
              <li key={item.id} className="relative flex gap-3 pl-1">
                {i !== items.length - 1 && (
                  <span
                    className="absolute left-[7px] top-4 h-[calc(100%+4px)] w-px bg-[#E3E5E0] dark:bg-[#2A2E35]"
                    aria-hidden
                  />
                )}
                <span
                  className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white ring-1 ring-[#E3E5E0] dark:border-[#15181D] dark:ring-[#2A2E35]"
                  style={{ backgroundColor: STATUS_COLOR[item.status].light }}
                />
                <div className="min-w-0">
                  <p className="text-sm text-[#12151A] dark:text-[#F3F4F1]">
                    <span className="font-medium">{item.actor}</span>{" "}
                    <span className="text-[#5B6472] dark:text-[#9CA3AF]">{item.action}</span>{" "}
                    <span className="font-mono text-[#B45309] dark:text-[#F59E0B]">{item.target}</span>{" "}
                    <span className="text-[#5B6472] dark:text-[#9CA3AF]">on {item.applicationName}</span>
                  </p>
                  <span className="font-mono text-xs text-[#5B6472] dark:text-[#9CA3AF]">{timeAgo(item.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}