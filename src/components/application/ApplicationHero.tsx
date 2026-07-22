"use client";

import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  Eye,
  Globe,
  Plus,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Application } from "./types";

type Props = {
  application: Application;
  updatesCount: number;
};

export default function ApplicationHero({
  application,
  updatesCount,
}: Props) {
  const created =
    application.createdAt &&
    new Date(application.createdAt).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-600 p-[1px] shadow-2xl">
      <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-sky-500/10" />

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 rounded-3xl border-4 border-background shadow-xl">
                <AvatarImage src={application.logo ?? undefined} />
                <AvatarFallback className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-3xl font-bold text-white">
                  {application.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight">
                    {application.name}
                  </h1>

                  <Badge
                    variant="secondary"
                    className="rounded-full px-3 py-1"
                  >
                    {updatesCount} Updates
                  </Badge>
                </div>

                {application.description && (
                  <p className="max-w-2xl text-muted-foreground leading-7">
                    {application.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{application.views.toLocaleString()} views</span>
                  </div>

                  {created && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{created}</span>
                    </div>
                  )}

                  {application.website && (
                    <Link
                      href={application.website}
                      target="_blank"
                      className="flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl shadow-lg transition-all hover:scale-[1.02]"
              >
                <Link href="/applications/updates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Update
                </Link>
              </Button>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}