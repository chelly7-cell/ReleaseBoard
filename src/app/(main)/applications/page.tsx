"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Plus,
  ExternalLink,
  Package,
  Eye,
  Layers,
  Search,
} from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";

type Application = {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  views: number;
  updatesCount: number;
};

type ApplicationsResponse = {
  items: Application[];
  page: number;
  pageSize: number;
  total: number;
};

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";

  const [applications, setApplications] = useState<Application[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [search, setSearch] = useState(urlSearch);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH
  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/applications?search=${encodeURIComponent(search)}`,
        {
          credentials: "include",
        }
      );

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Fetch failed");

      const data = (await res.json()) as ApplicationsResponse;
      setApplications(data.items);
    } catch {
      setApplications([]);
      setError("Unable to load applications");
    } finally {
      setLoading(false);
    }
  }, [router, search]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // CREATE
const handleCreate = async () => {
  try {
    setError("");

    const res = await fetch("/api/applications", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        logo: logo || null,
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to create application");
    }

    const application = await res.json();

    // Clear the form
    setName("");
    setLogo("");

    // Redirect to the new application's page
    router.push(`/applications/${application.id}`);
  } catch {
    setError("Failed to create application");
  }
};

  // STATS
  const stats = useMemo(() => {
    return {
      total: applications.length,
      views: applications.reduce((a, b) => a + (b.views || 0), 0),
      updates: applications.reduce((a, b) => a + (b.updatesCount || 0), 0),
    };
  }, [applications]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl p-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Applications
            </h1>
            <p className="text-muted-foreground">
              Manage your products and track releases
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Application</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My SaaS App"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>

                  <div className="border rounded-xl p-4 bg-muted/30 flex flex-col items-center gap-3">
                    {logo ? (
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={logo} />
                        <AvatarFallback>APP</AvatarFallback>
                      </Avatar>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No logo uploaded
                      </p>
                    )}

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        setLogo(res?.[0]?.url || "");
                      }}
                      onUploadError={(err) => alert(err.message)}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="w-full rounded-xl"
                  onClick={handleCreate}
                  disabled={!name}
                >
                  Create Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card className="p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">Total</Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats.total}</p>
          </Card>

          <Card className="p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">Views</Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats.views}</p>
          </Card>

          <Card className="p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <Layers className="w-5 h-5 text-muted-foreground" />
              <Badge variant="secondary">Updates</Badge>
            </div>
            <p className="text-2xl font-bold mt-3">{stats.updates}</p>
          </Card>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 border rounded-xl px-3 bg-background">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            className="border-0 focus-visible:ring-0"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5 rounded-2xl space-y-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card className="p-16 text-center rounded-2xl">
            <p className="text-lg font-semibold">No applications yet</p>
            <p className="text-muted-foreground">
              Create your first application to get started
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

            {applications.map((app) => (
              <Card
                key={app.id}
                className="p-5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={app.logo || ""} />
                      <AvatarFallback>
                        {app.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.views} views
                      </p>
                    </div>
                  </div>

                  <Link href={`/changelog/${app.id}`} target="_blank">
                    <ExternalLink className="w-4 h-4 hover:text-primary" />
                  </Link>
                </div>

                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">
                    {app.updatesCount} updates
                  </Badge>
                </div>

                <Button
                  className="w-full mt-4 rounded-xl"
                  variant="secondary"
                  onClick={() => router.push(`/applications/${app.id}`)}
                >
                  Open Dashboard
                </Button>
              </Card>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}