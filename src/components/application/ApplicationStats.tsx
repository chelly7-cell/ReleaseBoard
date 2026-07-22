"use client";

import {
  Eye,
  FileText,
  Rocket,
  PencilLine,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type Props = {
  views: number;
  totalUpdates: number;
  publishedUpdates: number;
  draftUpdates: number;
};

const stats = [
  {
    title: "Total Views",
    key: "views",
    icon: Eye,
  },
  {
    title: "Updates",
    key: "updates",
    icon: FileText,
  },
  {
    title: "Published",
    key: "published",
    icon: Rocket,
  },
  {
    title: "Drafts",
    key: "drafts",
    icon: PencilLine,
  },
] as const;

export default function ApplicationStats({
  views,
  totalUpdates,
  publishedUpdates,
  draftUpdates,
}: Props) {
  const values = {
    views: views.toLocaleString(),
    updates: totalUpdates,
    published: publishedUpdates,
    drafts: draftUpdates,
  };

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.key}
            className="group relative overflow-hidden rounded-3xl border bg-background/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-sky-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h3 className="text-3xl font-bold tracking-tight">
                  {values[item.key]}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}