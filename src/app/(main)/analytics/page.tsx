"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, BarChart3, Plus } from "lucide-react";




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

  // ---------------- EMPTY STATE (SHADCN STYLE) ----------------
  if (!data || data.overview.applications === 0) {
    return (
      <div className="p-10 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-10 flex flex-col items-center text-center gap-4">
            <div className="p-3 rounded-full bg-muted">
              <BarChart3 className="w-6 h-6 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              No analytics available yet
            </h2>

            <p className="text-sm text-muted-foreground max-w-sm">
              You don’t have any applications or updates yet. Create your first
              app to start tracking views, performance, and updates analytics.
            </p>

            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Application
            </Button>
          </CardContent>
        </Card>
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