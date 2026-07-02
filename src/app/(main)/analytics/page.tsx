"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  AlertCircle,
  BarChart3,
  Plus,
  Sparkles,
  TrendingUp,
  FileText,
  Eye,
  Pencil,
} from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type AnalyticsData = {
  overview: {
    applications: number;
    updates: number;
    published: number;
    drafts: number;
    totalViews: number;
    averageViews: number;
  };
  topApplications: any[];
  topUpdates: any[];
  recentApplications: any[];
};

export default function AnalysePage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to load analytics");

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="p-6 flex justify-center">
        <Card className="w-full max-w-md border-destructive">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="text-destructive h-6 w-6" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchAnalytics} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------- EMPTY STATE ----------------
  if (!data || data.overview.applications === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <Empty className="max-w-4xl border bg-background rounded-3xl shadow-sm">
          <EmptyHeader>
            <EmptyMedia className="bg-primary/10">
              <BarChart3 className="size-10 text-primary" />
            </EmptyMedia>

            <EmptyTitle className="text-3xl">
              No analytics yet
            </EmptyTitle>

            <EmptyDescription className="max-w-xl text-base">
              Start creating applications and publishing updates to unlock your
              analytics dashboard. Track views, engagement, and performance in
              real time.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/applications">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Application
                </Link>
              </Button>

              <Button variant="outline" size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: BarChart3,
                  title: "Real-time analytics",
                  desc: "Track performance instantly as users interact.",
                },
                {
                  icon: Eye,
                  title: "Engagement tracking",
                  desc: "See what users view and interact with most.",
                },
                {
                  icon: TrendingUp,
                  title: "Growth insights",
                  desc: "Understand what drives your application growth.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-5 bg-muted/20"
                >
                  <item.icon className="h-5 w-5 mb-3 text-primary" />
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const { overview } = data;

  const stats = [
    { label: "Applications", value: overview.applications, icon: FileText },
    { label: "Updates", value: overview.updates, icon: Pencil },
    { label: "Published", value: overview.published, icon: Sparkles },
    { label: "Drafts", value: overview.drafts, icon: FileText },
    { label: "Total Views", value: overview.totalViews, icon: Eye },
    { label: "Avg Views", value: overview.averageViews, icon: TrendingUp },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your applications performance and engagement.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TOP APPLICATIONS */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Top Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.topApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications data yet.
            </p>
          ) : (
            data.topApplications.map((app: any, i: number) => (
              <div
                key={app.id}
                className="flex justify-between items-center text-sm"
              >
                <span>{app.name}</span>
                <span className="text-muted-foreground">
                  {app.totalViews} views
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* TOP UPDATES */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Top Updates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.topUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No updates data yet.
            </p>
          ) : (
            data.topUpdates.map((u: any) => (
              <div
                key={u.id}
                className="flex justify-between items-center text-sm"
              >
                <span>{u.title}</span>
                <span className="text-muted-foreground">{u.views} views</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* RECENT APPS */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent applications.
            </p>
          ) : (
            data.recentApplications.map((app: any) => (
              <div
                key={app.id}
                className="flex justify-between items-center text-sm"
              >
                <span>{app.name}</span>
                <span className="text-muted-foreground">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}