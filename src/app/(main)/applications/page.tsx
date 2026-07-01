"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { Plus, ExternalLink } from "lucide-react";
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
  const search = searchParams.get("search") || "";

  const [applications, setApplications] = useState<Application[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        throw new Error("Unable to load applications");
      }

      const data = (await res.json()) as ApplicationsResponse;
      setApplications(data.items);
    } catch (error) {
      console.error(error);
      setApplications([]);
      setError("Unable to load applications. Please try again.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Unable to create application");
      }

      setName("");
      setLogo("");

      await loadApplications();
    } catch (error) {
      console.error("Create failed:", error);
      setError("Unable to create application. Please try again.");
    }
  };
  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-to-b from-background to-muted/20">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Applications</h1>
          <p className="text-muted-foreground">
            Manage your products and track releases
          </p>
        </div>

        {/* CREATE */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create Application</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">

              {/* NAME */}
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My SaaS App"
                />
              </div>

              {/* LOGO */}
              <div className="space-y-2">
                <Label>Logo</Label>

                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-3 bg-muted/30">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Application logo preview"
                      className="w-20 h-20 rounded-xl object-cover"
                    />
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
                    onUploadError={(error) => {
                      alert(error.message);
                    }}
                  />
                </div>
              </div>

              <Button className="w-full rounded-xl" onClick={handleCreate}>
                Create Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CONTENT */}
      {error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-muted rounded-2xl" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl">
          <h2 className="font-semibold">No applications yet</h2>
          <p className="text-muted-foreground">
            Create your first application
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {applications.map((app) => (
            <Card
              key={app.id}
              className="p-5 rounded-2xl hover:shadow-lg transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {app.logo ? (
                    <img
                      src={app.logo}
                      alt={`${app.name} logo`}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded-xl" />
                  )}

                  <div>
                    <p className="font-semibold">{app.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.views ?? 0} views
                    </p>
                  </div>
                </div>

                <Link
                  href={`/changelog/${app.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 hover:text-primary transition-colors" />
                </Link>
              </div>

              {/* ACTION */}
              <Button
                className="w-full mt-4 rounded-xl"
                variant="secondary"
                onClick={() => router.push(`/applications/${app.id}`)}
              >
                Open Application
              </Button>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}
