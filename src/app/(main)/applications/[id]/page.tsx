"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Application = {
  id: number;
  name: string;
  logo: string | null;
  views: number;
};

type Update = {
  id: number;
  title: string;
  version: string;
  status: string;
};

type ApplicationDetailsResponse = {
  application: Application;
  updates: Update[];
};

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<Application | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/applications/${id}`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        setError("Application not found.");
        return;
      }

      if (!res.ok) {
        throw new Error("Unable to load application");
      }

      const data = (await res.json()) as ApplicationDetailsResponse;

      setApp(data.application);
      setUpdates(data.updates);
    } catch (error) {
      console.error(error);
      setError("Unable to load application. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadData();
  }, [id, loadData]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (error || !app) {
    return <p className="p-6 text-muted-foreground">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
          {app.logo ? (
            <img
              src={app.logo}
              alt={app.name}
              className="w-10 h-10 rounded"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs">
              APP
            </div>
          )}

          {app.name}
        </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          <p>Views: {app.views ?? 0}</p>
          <p>Updates: {updates.length}</p>

            <Link href="/updates/new">
              <Button>
                Create Update
              </Button>
            </Link>
        </CardContent>
      </Card>

      {/* UPDATES LIST */}
      <div className="space-y-3">
        {updates.map((u) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-semibold">{u.title}</p>
                <p className="text-sm text-gray-500">
                  Version: {u.version}
                </p>
              </div>

              <span className="text-sm">{u.status}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
