"use client";

import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentUpdate, UpdateStatus } from "./types";

const STATUS_STYLE: Record<UpdateStatus, string> = {
  published:
    "text-[#0B6E64] bg-[#0B6E64]/10 border-[#0B6E64]/20 dark:text-[#2DD4BF] dark:bg-[#2DD4BF]/10 dark:border-[#2DD4BF]/25",
  draft:
    "text-[#B45309] bg-[#B45309]/10 border-[#B45309]/20 dark:text-[#F59E0B] dark:bg-[#F59E0B]/10 dark:border-[#F59E0B]/25",
  archived:
    "text-[#5B6472] bg-[#5B6472]/10 border-[#5B6472]/20 dark:text-[#9CA3AF] dark:bg-[#9CA3AF]/10 dark:border-[#9CA3AF]/20",
};

export default function RecentUpdates({
  updates,
  loading,
}: {
  updates: RecentUpdate[];
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#E3E5E0] bg-white dark:border-[#2A2E35] dark:bg-[#15181D]">
      <div className="flex items-center justify-between border-b border-[#E3E5E0] p-6 dark:border-[#2A2E35]">
        <div>
          <h3 className="text-sm font-semibold text-[#12151A] dark:text-[#F3F4F1]">Recent updates</h3>
          <p className="mt-0.5 text-xs text-[#5B6472] dark:text-[#9CA3AF]">latest entries across every application</p>
        </div>
        <Link
          href="applications/updates"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0B6E64] hover:underline dark:text-[#2DD4BF]"
        >
          view all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs text-[#5B6472] dark:text-[#9CA3AF]">Application</TableHead>
            <TableHead className="text-xs text-[#5B6472] dark:text-[#9CA3AF]">Title</TableHead>
            <TableHead className="text-xs text-[#5B6472] dark:text-[#9CA3AF]">Version</TableHead>
            <TableHead className="text-xs text-[#5B6472] dark:text-[#9CA3AF]">Status</TableHead>
            <TableHead className="text-right text-xs text-[#5B6472] dark:text-[#9CA3AF]">Views</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [0, 1, 2].map((i) => (
              <TableRow key={i}>
                <TableCell colSpan={5} className="p-0">
                  <div className="m-3 h-8 animate-pulse rounded bg-[#F3F4F1] dark:bg-[#1D2127]" />
                </TableCell>
              </TableRow>
            ))
          ) : updates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-sm text-[#5B6472] dark:text-[#9CA3AF]">
                No releases yet — your changelog starts here.
              </TableCell>
            </TableRow>
          ) : (
            updates.map((update) => (
              <TableRow
                key={update.id}
                className="border-[#E3E5E0] hover:bg-[#0B6E64]/[0.03] dark:border-[#2A2E35] dark:hover:bg-[#2DD4BF]/[0.05]"
              >
                <TableCell className="text-sm text-[#5B6472] dark:text-[#9CA3AF]">{update.applicationName}</TableCell>
                <TableCell className="text-sm font-medium text-[#12151A] dark:text-[#F3F4F1]">{update.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded border border-[#B45309]/25 bg-[#B45309]/10 px-2 py-0.5 font-mono text-xs text-[#B45309] dark:border-[#F59E0B]/25 dark:bg-[#F59E0B]/10 dark:text-[#F59E0B]">
                    <Tag className="h-3 w-3" />
                    {update.version}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs capitalize ${STATUS_STYLE[update.status]}`}
                  >
                    {update.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-[#5B6472] dark:text-[#9CA3AF]">
                  {update.views.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}