"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  Rocket,
  Bell,
  BarChart3,
  Settings,
  Plus,
  LogOut,
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

interface Update {
  id: number;
  title: string;
  content: string;
  version: string;
  status: string;
  views: number;
  createdAt: string;
  applicationId: number;
  applicationName?: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<{
  name?: string;
  email?: string;
  image?: string;
} | null>(null);

  const [stats, setStats] = useState({
    applications: 0,
    updates: 0,
    views: 0,
    published: 0,
  });

  const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);

  useEffect(() => {
  async function loadDashboard() {
  try {
    const [dashboardRes, userRes] = await Promise.all([
      fetch("/api/auth/dashboard"),
      fetch("/api/auth/me"),
    ]);

    const data = await dashboardRes.json();
    const userData = await userRes.json();

    setUser(userData);

    const updates = Array.isArray(data.recentUpdates)
  ? data.recentUpdates
  : [];

setRecentUpdates(updates);

setStats({
  applications: Number(data.applications ?? 0),
  updates: Number(data.updates ?? 0),
  views: Number(data.views ?? 0),
  published: updates.filter(
    (u: any) => u.status === "published"
  ).length,
});
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  loadDashboard();
}, []);

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex w-64 border-r bg-background flex-col">
        <div className="h-16 border-b flex items-center px-6">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              <img src="logo.svg.png" alt="Logo" className="w-8 h-8" />
            </div>
          <h2 className="font-bold text-xl">
            ReleaseBoard
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/changelog">
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Changelog Articles
            </Button>
          </Link> 


          <Link href="/dashboard">
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/applications">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Applications
            </Button>
          </Link>

          <Link href="/dashboard/updates">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Bell className="mr-2 h-4 w-4" />
              Updates
            </Button>
          </Link>

          <Link href="/analytics">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>

          <Link href="/settings">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              await fetch("/api/auth/logout", {
                method: "POST",
              });

              window.location.href = "/login";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back {user?.name ? `${user.name} 👋` : "👋"}
            </h1>

            <p className="text-muted-foreground">
              Manage your applications and release updates.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/dashboard/updates/new">
                <Plus className="mr-2 h-4 w-4" />
                New Update
              </Link>
            </Button>

            <Avatar>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Applications
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "..." : stats.applications}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Updates
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "..." : stats.updates}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Total Views
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "..." : stats.views}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Published
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">
                {loading ? "..." : stats.published}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Update</CardTitle>
              <CardDescription>
                Publish a new release note.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild className="w-full">
                <Link href="/dashboard/updates">
                  New Update
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Application</CardTitle>
              <CardDescription>
                Register a new application.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button asChild className="w-full">
                <Link href="/applications">
                  Add App
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View traffic and engagement.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link href="/analytics">
                  Open Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              Latest published releases.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name of App</TableHead>
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
                      className="text-center"
                    >
                      No updates found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentUpdates.map((update) => (
                    <TableRow key={update.id}>
                      <TableCell>
                        {update.applicationName || "Unknown App"}
                      </TableCell>

                      <TableCell>
                        {update.title}
                      </TableCell>

                      <TableCell>
                        {update.version}
                      </TableCell>

                      <TableCell>
                        <Badge>
                          {update.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {update.views}
                      </TableCell>

                      <TableCell>
                        {new Date(update.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
            </Table>
          </CardContent>
        </Card>
        
      </main>
    </div>
  );
}