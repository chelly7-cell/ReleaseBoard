"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Plus,
  Search,
  Calendar,
  Package,
  Rocket,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Update {
  id: number;
  title: string;
  version: string;
  status: string;
  createdAt: string;
  applicationName: string;
  applicationLogo: string;
}

type UpdatesResponse = {
  items: Update[];
  page: number;
  pageSize: number;
  total: number;
};

export default function UpdatesPage() {
  const router = useRouter();

  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/updates");

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error();

        const data = (await res.json()) as UpdatesResponse;
        setUpdates(data.items);
      } catch {
        setError("Unable to load updates.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const filteredUpdates = useMemo(() => {
    return updates.filter((u) => {
      const text =
        `${u.title} ${u.applicationName} ${u.version}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [updates, search]);

  const published = updates.filter(
      (u) => u.status.toLowerCase() === "published"
    ).length;

  const draft = updates.filter(
    (u) => u.status.toLowerCase() === "draft"
  ).length;

  const getBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "released":
        return (
          <Badge className="bg-green-500 hover:bg-green-500 text-white">
            Released
          </Badge>
        );

      case "draft":
        return (
          <Badge variant="secondary">
            Draft
          </Badge>
        );

      case "scheduled":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-500 text-white">
            Scheduled
          </Badge>
        );

      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HERO */}

        <div className="rounded-3xl border bg-gradient-to-br from-background to-muted/50 p-10 mb-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <p className="text-sm text-muted-foreground mb-2">
                Release Management
              </p>

              <h1 className="text-5xl font-bold tracking-tight">
                Updates
              </h1>

              <p className="mt-4 max-w-2xl text-muted-foreground text-lg">
                Manage every release of your applications from one beautiful
                dashboard.
              </p>

            </div>

            <Button
              asChild
              size="lg"
              className="rounded-xl px-6"
            >
              <Link href="/updates/new">
                <Plus className="mr-2 h-5 w-5" />
                Create Update
              </Link>
            </Button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid gap-6 md:grid-cols-3 mb-10">

          <Card className="rounded-2xl p-6">
            <div className="flex justify-between">

              <div>

                <p className="text-muted-foreground text-sm">
                  Total Updates
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {updates.length}
                </h2>

              </div>

              <Package className="h-8 w-8 text-muted-foreground" />

            </div>
          </Card>

          <Card className="rounded-2xl p-6">
            <div className="flex justify-between">

              <div>

                <p className="text-muted-foreground text-sm">
                  Released
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {published}
                </h2>

              </div>

              <Rocket className="h-8 w-8 text-green-500" />

            </div>
          </Card>

          <Card className="rounded-2xl p-6">
            <div className="flex justify-between">

              <div>

                <p className="text-muted-foreground text-sm">
                  Drafts
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {draft}
                </h2>

              </div>

              <Clock className="h-8 w-8 text-orange-500" />

            </div>
          </Card>

        </div>

        {/* STATES */}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card
                key={i}
                className="h-28 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <Card className="rounded-2xl p-12 text-center text-red-500">
            {error}
          </Card>
        )}

        {!loading && !error && filteredUpdates.length === 0 && (
          <Card className="rounded-2xl p-20 text-center">

            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

            <h2 className="text-xl font-semibold">
              No updates found
            </h2>

            <p className="text-muted-foreground mt-2">
              Create your first release to start tracking changes.
            </p>

          </Card>
        )}

        {!loading && !error && filteredUpdates.length > 0 && (
          <div className="space-y-5">

            {filteredUpdates.map((u) => (
              <Card
                key={u.id}
                className="group rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6">

                  <div className="flex items-center gap-5">

                    {u.applicationLogo ? (
                      <Image
                        src={u.applicationLogo}
                        alt={u.applicationName}
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        {u.applicationName.charAt(0)}
                      </div>
                    )}Name="rounded-2xl border object-cover"
                    

                    <div>

                      <h2 className="text-xl font-semibold group-hover:text-primary transition">
                        {u.title}
                      </h2>

                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">

                        <span>
                          {u.applicationName}
                        </span>

                        <span>•</span>

                        <span>
                          v{u.version}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="flex items-center gap-5">

                    {getBadge(u.status)}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                      <Calendar className="h-4 w-4" />

                      {new Date(
                        u.createdAt
                      ).toLocaleDateString()}

                    </div>

                    <Button asChild variant="outline">
                      <Link
                        href={`/updates/${u.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </Button>

                  </div>

                </div>
              </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}