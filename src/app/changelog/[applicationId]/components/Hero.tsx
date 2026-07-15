"use client";

import { Eye, Package, Globe } from "lucide-react";

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
    <section className="border-b bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

          <div className="flex items-center gap-5">
            {app.logo ? (
              <img
                src={app.logo}
                alt={app.name}
                className="h-20 w-20 rounded-2xl border object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-muted text-2xl font-bold">
                {app.name.charAt(0)}
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Public Changelog
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {app.name}
              </h1>

              <p className="mt-3 max-w-xl text-muted-foreground">
                Latest updates, improvements and releases from {app.name}.
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {app.views} views
                </span>

                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {releaseCount} releases
                </span>

                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Public
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}