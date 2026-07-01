"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Plus,
  Rocket,
  Eye,
  Layers,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type RecentUpdate = {
  id: number;
  title: string;
  version: string;
  status: string;
  views: number;
  createdAt: string;
  applicationId: number;
  applicationName: string;
};

type DashboardResponse = {
  applications: number;
  updates: number;
  views: number;
  published: number;
  recentUpdates: RecentUpdate[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);

  const [stats, setStats] = useState({
    applications: 0,
    updates: 0,
    views: 0,
    published: 0,
  });

  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [dash, me] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/me"),
        ]);

        if (dash.status === 401 || me.status === 401) {
          router.push("/login");
          return;
        }

        if (!dash.ok || !me.ok) {
          throw new Error("Dashboard request failed");
        }

        const d = (await dash.json()) as DashboardResponse;
        const u = (await me.json()) as UserProfile;

        setUser(u);
        setRecentUpdates(d.recentUpdates);

        setStats({
          applications: d.applications,
          updates: d.updates,
          views: d.views,
          published: d.published,
        });
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const cards = [
    {
      title: "Applications",
      value: stats.applications,
      icon: Layers,
    },
    {
      title: "Updates",
      value: stats.updates,
      icon: Rocket,
    },
    {
      title: "Views",
      value: stats.views,
      icon: Eye,
    },
    {
      title: "Published",
      value: stats.published,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge
            variant="secondary"
            className="mb-4 rounded-full"
          >
            ReleaseBoard
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user?.name || "Developer"}
          </h1>

          <p className="mt-3 text-muted-foreground text-lg">
            Manage releases, applications and analytics from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-2xl"
          >
            <Link href="/updates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Update
            </Link>
          </Button>

          <Avatar className="h-11 w-11 border">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Card
              key={index}
              className="
                rounded-3xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {card.title}
                </CardTitle>

                <div className="rounded-xl border p-2">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-4xl font-bold">
                  {loading ? "..." : card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Create Update</CardTitle>
            <CardDescription>
              Publish release notes instantly.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              asChild
              className="w-full rounded-xl"
            >
              <Link href="/updates/new">
                Create Update
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Add Application</CardTitle>
            <CardDescription>
              Register a new application.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              asChild
              className="w-full rounded-xl"
            >
              <Link href="/applications">
                Add Application
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              View engagement metrics.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              asChild
              className="w-full rounded-xl"
            >
              <Link href="/analytics">
                Open Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* RECENT UPDATES */}
      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest release activity
            </CardDescription>
          </div>

          <Button
            size="sm"
            asChild
          >
            <Link href="/updates">
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recentUpdates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No updates yet
                  </TableCell>
                </TableRow>
              ) : (
                recentUpdates.map((update) => (
                  <TableRow
                    key={update.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      {update.applicationName}
                    </TableCell>

                    <TableCell className="font-medium">
                      {update.title}
                    </TableCell>

                    <TableCell>
                      {update.version}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          update.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className="rounded-full"
                      >
                        {update.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {update.views}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        update.createdAt
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

