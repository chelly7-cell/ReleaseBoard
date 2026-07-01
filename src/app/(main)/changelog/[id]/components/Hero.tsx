"use client";

import Link from "next/link";
import { Eye, Package, Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
type HeroProps = {
  app: {
    name: string;
    logo: string | null;
    views: number;
  };
  releaseCount: number;
};

export default function Hero({ app, releaseCount }: HeroProps) {
  return (
    <section className="relative border-b bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* TOP ROW */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">

          {/* LEFT */}
          <div className="flex gap-5">

            {/* LOGO */}
            {app.logo ? (
              <img
                src={app.logo}
                alt={app.name}
                className="h-16 w-16 rounded-2xl border object-cover shadow-sm"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl border bg-muted font-bold text-lg">
                {app.name?.charAt(0)}
              </div>
            )}

            {/* TEXT */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Release Notes
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {app.name}
              </h1>

              <p className="mt-3 max-w-xl text-muted-foreground text-lg leading-7">
                Official release notes for your application.
                Ship faster, track every update, and keep users informed.
              </p>

              {/* STATS */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {app.views} Views
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {releaseCount} Releases
                </div>

                <div className="px-2 py-1 rounded-full border text-xs">
                  Public
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-wrap gap-3">

            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Website
            </Button>

            <Button variant="outline" size="sm">
              <FaGithub className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <Link href="/updates/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create Release
              </Button>
            </Link>

          </div>
        </div>

        {/* BOTTOM LINE (optional polish) */}
        <div className="mt-12 flex items-center justify-between text-xs text-muted-foreground">
          <span>Keep your changelog clean and professional</span>
          <span>Updated automatically from your releases</span>
        </div>

      </div>
    </section>
  );
}