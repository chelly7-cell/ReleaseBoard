"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowRight,
  Eye,
  ExternalLink,
  Layers3,
  Package2,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";

import { UploadButton } from "@/lib/uploadthing";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(urlSearch);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");

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

      if (!res.ok) {
        throw new Error();
      }

      const data: ApplicationsResponse = await res.json();

      setApplications(data.items);
    } catch {
      setApplications([]);
      setError("Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  }, [router, search]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

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

      if (res.status ===401){
        router.push("/login");
        return;
      }

      if (!res.ok){
        throw new Error();
      }

      const application = await res.json();

      setName("");
      setLogo("");

      router.push(`/applications/${application.id}`);
    } catch {
      setError("Failed to create application.");
    }
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      views: applications.reduce((sum, app) => sum + (app.views || 0), 0),
      updates: applications.reduce(
        (sum, app) => sum + (app.updatesCount || 0),
        0
      ),
    };
  }, [applications]);

  return (
  <div className="relative min-h-screen overflow-hidden bg-[#11131] from-background via-background to-muted/30">

    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#11131] blur-3xl" />
    <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#11131] blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-6 py-10 space-y-10">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl border bg-background/70 backdrop-blur-xl">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-cyan-500/5" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between p-10">

          <div className="max-w-2xl">

            <Badge className="rounded-full px-4 py-1 gap-2">

              <Sparkles className="h-3.5 w-3.5" />

              ReleaseBoard

            </Badge>

            <h1 className="mt-6 text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">

              Applications

            </h1>

            <p className="mt-5 text-lg text-muted-foreground leading-8">

              Manage all your products, publish releases, monitor analytics,
              and keep your users informed with beautiful changelogs.

            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <Dialog>

                <DialogTrigger asChild>

                  <Button
                    size="lg"
                    className="rounded-xl shadow-lg shadow-blue-500/20"
                  >

                    <Plus className="mr-2 h-4 w-4" />

                    New Application

                  </Button>

                </DialogTrigger>

                <DialogContent className="sm:max-w-lg rounded-3xl">

                  <DialogHeader>

                    <DialogTitle className="text-2xl">

                      Create Application

                    </DialogTitle>

                  </DialogHeader>

                  <div className="space-y-6 py-2">

                    <div className="space-y-2">

                      <Label>Application Name</Label>

                      <Input
                        placeholder="ReleaseBoard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 rounded-xl"
                      />

                    </div>

                    <div className="space-y-3">

                      <Label>Logo</Label>

                      <div className="rounded-2xl border bg-muted/40 p-6">

                        <div className="flex flex-col items-center gap-5">

                          {logo ? (
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={logo} alt="Application logo" />
                              <AvatarFallback>
                                {name ? name.charAt(0).toUpperCase() : "A"}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-20 w-20">
                              <AvatarFallback>
                                {name ? name.charAt(0).toUpperCase() : "A"}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              setLogo(res?.[0]?.url ?? "");
                            }}
                            onUploadError={(err) => alert(err.message)}
                          />

                          

                        </div>

                      </div>

                    </div>

                  </div>

                  <DialogFooter>

                    <Button
                      className="w-full rounded-xl h-11"
                      disabled={!name}
                      onClick={handleCreate}
                    >

                      Create Application

                    </Button>

                  </DialogFooter>

                </DialogContent>

              </Dialog>

            </div>

          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-4">

            <Card className="rounded-3xl border-0 bg-background/80 backdrop-blur p-6">

              <div className="flex items-center justify-between">

                <div className="rounded-2xl bg-blue-500/10 p-3">

                  <Package2 className="h-5 w-5 text-blue-600" />

                </div>

                <Badge variant="secondary">

                  Total

                </Badge>

              </div>

              <h2 className="mt-8 text-4xl font-bold">

                {stats.total}

              </h2>

              <p className="mt-2 text-sm text-muted-foreground">

                Applications

              </p>

            </Card>

            <Card className="rounded-3xl border-0 bg-background/80 backdrop-blur p-6">

              <div className="flex items-center justify-between">

                <div className="rounded-2xl bg-violet-500/10 p-3">

                  <Eye className="h-5 w-5 text-violet-600" />

                </div>

                <Badge variant="secondary">

                  Views

                </Badge>

              </div>

              <h2 className="mt-8 text-4xl font-bold">

                {stats.views}

              </h2>

              <p className="mt-2 text-sm text-muted-foreground">

                Total Views

              </p>

            </Card>

            <Card className="col-span-2 rounded-3xl border-0 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 text-white p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-white/80 text-sm">

                    Published Updates

                  </p>

                  <h2 className="mt-2 text-5xl font-bold">

                    {stats.updates}

                  </h2>

                </div>

                <Layers3 className="h-10 w-10 opacity-80" />

              </div>

            </Card>

          </div>

        </div>

      </div>

              {/* SEARCH */}

      <div className="flex flex-col gap-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="relative w-full lg:max-w-md">

            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="h-12 rounded-2xl border bg-background pl-11 shadow-sm"
            />

          </div>

          <Badge
            variant="secondary"
            className="rounded-xl px-4 py-2 text-sm"
          >
            {applications.length} Applications
          </Badge>

        </div>

        {error && (

          <Card className="rounded-2xl border-red-500/20 bg-red-500/5 p-5">

            <p className="font-medium text-red-500">

              {error}

            </p>

          </Card>

        )}

        {loading ? (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({ length: 6 }).map((_, index) => (

              <Card
                key={index}
                className="rounded-3xl p-6 space-y-5"
              >

                <div className="flex items-center gap-4">

                  <Skeleton className="h-14 w-14 rounded-2xl" />

                  <div className="flex-1 space-y-2">

                    <Skeleton className="h-4 w-40" />

                    <Skeleton className="h-3 w-24" />

                  </div>

                </div>

                <Skeleton className="h-20 rounded-xl" />

                <div className="flex gap-2">

                  <Skeleton className="h-6 w-20 rounded-full" />

                  <Skeleton className="h-6 w-24 rounded-full" />

                </div>

                <Skeleton className="h-11 rounded-xl" />

              </Card>

            ))}

          </div>

        ) : applications.length === 0 ? (

          <Card className="rounded-3xl border-dashed p-20">

            <div className="mx-auto flex max-w-md flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-500/10">

                <Package2 className="h-12 w-12 text-blue-600" />

              </div>

              <h2 className="mt-8 text-3xl font-bold">

                No applications yet

              </h2>

              <p className="mt-4 text-muted-foreground leading-7">

                Create your first application and start publishing
                professional release notes for your users.

              </p>

              <Button
                className="mt-8 rounded-xl"
                onClick={() => {
                  const button = document.querySelector(
                    "[data-state]"
                  ) as HTMLButtonElement | null;

                  button?.click();
                }}
              >

                <Plus className="mr-2 h-4 w-4" />

                Create Application

              </Button>

            </div>

          </Card>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in duration-500">
            {applications.map((app) => (
  <Card
    key={app.id}
    className="group relative overflow-hidden rounded-3xl border bg-background/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-violet-500/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative p-6">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          <Avatar className="h-14 w-14 rounded-2xl ring-1 ring-border transition-transform duration-300 group-hover:scale-110">

            {app.logo ? (
              <AvatarImage src={app.logo} />
            ) : null}

            <AvatarFallback>
              {app.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>

          

          </Avatar>

          <div>

            <h3 className="text-lg font-semibold leading-none">

              {app.name}

            </h3>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">

              {app.description ||
                "Manage releases, publish changelogs and keep your users updated."}

            </p>

          </div>

        </div>

        <Link
          href={`/changelog/${app.id}`}
          target="_blank"
        >
          <Button
            size="icon"
            variant="ghost"
            className="rounded-xl"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">

        <div className="rounded-2xl border bg-muted/30 p-4">

          <div className="flex items-center gap-2 text-muted-foreground">

            <Eye className="h-4 w-4" />

            <span className="text-xs uppercase tracking-wide">

              Views

            </span>

          </div>

          <p className="mt-3 text-2xl font-bold">

            {app.views.toLocaleString()}

          </p>

        </div>

        <div className="rounded-2xl border bg-muted/30 p-4">

          <div className="flex items-center gap-2 text-muted-foreground">

            <Layers3 className="h-4 w-4" />

            <span className="text-xs uppercase tracking-wide">

              Updates

            </span>

          </div>

          <p className="mt-3 text-2xl font-bold">

            {app.updatesCount}

          </p>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between">

        <Badge className="rounded-full px-3 py-1">

          Active

        </Badge>

        <p className="text-xs text-muted-foreground">

          Ready to publish

        </p>

      </div>

      <Button
        onClick={() => router.push(`/applications/${app.id}`)}
        className="mt-8 h-11 w-full rounded-2xl"
      >
        Open Dashboard

        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />

      </Button>

    </div>

  </Card>
))}          </div>

        )}

      </div>

    </div>

  </div>
);
}