"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Pencil,
  Rocket,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { Update } from "./types";

type Props = {
  update: Update;
};

export default function UpdateCard({ update }: Props) {
  const published = update.status === "published";

  const date = update.createdAt
    ? new Date(update.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Card className="group overflow-hidden rounded-3xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <div className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
                {published ? (
                  <Rocket className="h-6 w-6" />
                ) : (
                  <FileText className="h-6 w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="truncate text-xl font-semibold">
                    {update.title}
                  </h3>

                  <Badge
                    variant={published ? "default" : "secondary"}
                    className={
                      published
                        ? "bg-emerald-600 hover:bg-emerald-600"
                        : ""
                    }
                  >
                    {published ? "Published" : "Draft"}
                  </Badge>

                  <Badge variant="outline">
                    v{update.version}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {date}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-xl"
              >
                <Link href={`/applications/updates/${update.id}`}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>

              <Button
                asChild
                className="rounded-xl"
              >
                <Link href={`/applications/updates/${update.id}/editor`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}