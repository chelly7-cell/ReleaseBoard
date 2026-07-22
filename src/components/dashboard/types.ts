export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type StatsData = {
  applications: number;
  updates: number;
  views: number;
  published: number;
};

export type UpdateStatus = "published" | "draft" | "archived";

export type RecentUpdate = {
  id: number;
  title: string;
  version: string;
  status: UpdateStatus;
  views: number;
  createdAt: string;
  applicationId: number;
  applicationName: string;
};

export type Application = {
  id: number;
  name: string;
  slug: string;
  updatesCount: number;
  status: "active" | "paused";
};

export type ActivityItem = {
  id: number;
  actor: string;
  action: "published" | "created" | "archived" | "edited";
  target: string;
  applicationName: string;
  createdAt: string;
  status: UpdateStatus;
};

export type AnalyticsPoint = {
  date: string;
  views: number;
};

export type DashboardData = {
  stats: StatsData;
  recentUpdates: RecentUpdate[];
  applications: Application[];
  activity: ActivityItem[];
  analytics: AnalyticsPoint[];
};