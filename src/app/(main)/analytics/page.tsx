"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, BarChart3, Plus, Sparkles } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";



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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
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
        <Card className="w-full max-w-md border-red-500">
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="text-red-500" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchAnalytics}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

 if (!data || data.overview.applications === 0) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <Empty className="max-w-3xl border bg-background rounded-2xl shadow-sm">
        <EmptyHeader>
          <EmptyMedia className="bg-primary/10">
            <BarChart3 className="size-8 text-primary" />
          </EmptyMedia>

          <EmptyTitle className="text-3xl">
            Your analytics dashboard is empty
          </EmptyTitle>

          <EmptyDescription className="max-w-xl text-base">
            Analytics will automatically appear once you create your first
            application and start publishing updates. Track views, monitor
            engagement, and discover your best-performing releases—all in one
            place.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="/applications/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Application
              </Link>
            </Button>

            <Button variant="outline" size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Learn More
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="rounded-xl border p-5 text-left">
              <BarChart3 className="h-5 w-5 mb-3 text-primary" />
              <h3 className="font-medium">Real-time Insights</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Watch application performance update automatically.
              </p>
            </div>

            <div className="rounded-xl border p-5 text-left">
              <Sparkles className="h-5 w-5 mb-3 text-primary" />
              <h3 className="font-medium">Track Engagement</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Measure views and understand which releases perform best.
              </p>
            </div>

            <div className="rounded-xl border p-5 text-left">
              <Plus className="h-5 w-5 mb-3 text-primary" />
              <h3 className="font-medium">Publish Faster</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first application to unlock your dashboard.
              </p>
            </div>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

  const { overview } = data;

  return (
    <div className="p-6 space-y-6">
      {/* OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Apps</CardTitle>
          </CardHeader>
          <CardContent>{overview.applications}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updates</CardTitle>
          </CardHeader>
          <CardContent>{overview.updates}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
          </CardHeader>
          <CardContent>{overview.published}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drafts</CardTitle>
          </CardHeader>
          <CardContent>{overview.drafts}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>{overview.totalViews}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Views</CardTitle>
          </CardHeader>
          <CardContent>{overview.averageViews}</CardContent>
        </Card>
      </div>

      {/* TOP APPLICATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Top Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications data yet.
            </p>
          ) : (
            data.topApplications.map((app) => (
              <div
                key={app.id}
                className="flex justify-between py-2 border-b text-sm"
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
      <Card>
        <CardHeader>
          <CardTitle>Top Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No updates data yet.
            </p>
          ) : (
            data.topUpdates.map((u) => (
              <div
                key={u.id}
                className="flex justify-between py-2 border-b text-sm"
              >
                <span>{u.title}</span>
                <span className="text-muted-foreground">{u.views} views</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* RECENT APPS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent applications.
            </p>
          ) : (
            data.recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex justify-between py-2 border-b text-sm"
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