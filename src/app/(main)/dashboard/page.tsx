"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHero from "@/components/dashboard/DashboardHero";
import StatsCards from "@/components/dashboard/StatsCards";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ApplicationsGrid from "@/components/dashboard/ApplicationsGrid";
import RecentUpdates from "@/components/dashboard/RecentUpdates";
import QuickActions from "@/components/dashboard/QuickActions";

import type { DashboardData, UserProfile } from "@/components/dashboard/types";

const EMPTY: DashboardData = {
  stats: { applications: 0, updates: 0, views: 0, published: 0 },
  recentUpdates: [],
  applications: [],
  activity: [],
  analytics: [],
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<DashboardData>(EMPTY);

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, meRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/me"),
        ]);

        if (dashRes.status === 401 || meRes.status === 401) {
          router.push("/login");
          return;
        }

        if (!dashRes.ok || !meRes.ok) {
          throw new Error("Failed to load dashboard");
        }

        const dashboard = await dashRes.json();
        const profile = (await meRes.json()) as UserProfile;

        setUser(profile);

        // Merge onto EMPTY so the page still renders cleanly if /api/dashboard
        // hasn't been extended yet with applications / activity / analytics.
        setData({
          stats: {
            applications: dashboard.applications ?? 0,
            updates: dashboard.updates ?? 0,
            views: dashboard.views ?? 0,
            published: dashboard.published ?? 0,
          },
          recentUpdates: dashboard.recentUpdates ?? [],
          applications: dashboard.applicationsList ?? [],
          activity: dashboard.activity ?? [],
          analytics: dashboard.analytics ?? [],
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  return (
    <div className="min-h-screen space-y-8 bg-[#11131] p-8">
      <DashboardHero user={user} stats={data.stats} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <StatsCards stats={data.stats} loading={loading} />

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart data={data.analytics} loading={loading} />
        </div>
        <ActivityFeed items={data.activity} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ApplicationsGrid applications={data.applications} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <RecentUpdates updates={data.recentUpdates} loading={loading} />
        </div>
      </div>
    </div>
  );
}