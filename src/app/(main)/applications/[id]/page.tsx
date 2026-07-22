"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  AlertCircle,
  FolderOpen,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import ApplicationHero from "@/components/application/ApplicationHero";
import ApplicationStats from "@/components/application/ApplicationStats";
import ApplicationSkeleton from "@/components/application/ApplicationSkeleton";
import EmptyUpdates from "@/components/application/EmptyUpdates";
import UpdateCard from "@/components/application/UpdateCard";

import type {
  Application,
  ApplicationDetailsResponse,
  Update,
} from "@/components/application/types";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [application, setApplication] =
    useState<Application | null>(null);

  const [updates, setUpdates] =
    useState<Update[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/applications/${id}`, {
        cache: "no-store",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.status === 404) {
        setError("Application not found.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load application");
      }

      const data =
        (await res.json()) as ApplicationDetailsResponse;

      setApplication(data.application);
      setUpdates(data.updates);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while loading this application."
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, loadData]);

  const publishedUpdates = useMemo(
    () =>
      updates.filter(
        (u) => u.status === "published"
      ).length,
    [updates]
  );

  const draftUpdates = useMemo(
    () =>
      updates.filter(
        (u) => u.status !== "published"
      ).length,
    [updates]
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <ApplicationSkeleton />
      </div>
    );
  }

  if (!application || error) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <Card className="rounded-3xl border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">

              <AlertCircle className="h-10 w-10 text-red-600" />

            </div>

            <h2 className="mb-2 text-3xl font-bold">
              Unable to load application
            </h2>

            <p className="mb-8 max-w-md text-muted-foreground">
              {error}
            </p>

            <Button
              onClick={loadData}
              size="lg"
              className="rounded-xl"
            >
              Try Again
            </Button>

          </CardContent>
        </Card>
      </div>
    );
  }
    return (
    <main className="container mx-auto max-w-7xl space-y-8 p-6">

      {/* HERO */}
      <ApplicationHero
        application={application}
        updatesCount={updates.length}
      />


      {/* STATS */}
      <ApplicationStats
        views={application.views}
        totalUpdates={updates.length}
        publishedUpdates={publishedUpdates}
        draftUpdates={draftUpdates}
      />


      {/* UPDATES SECTION */}
      <section className="space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
                <FolderOpen className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Releases
              </h2>

            </div>

            <p className="mt-2 text-muted-foreground">
              Manage your application updates and release notes.
            </p>
          </div>


          <Button
            asChild
            className="rounded-xl shadow-lg transition-all hover:scale-[1.02]"
          >
            <a href="/applications/updates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Update
            </a>
          </Button>

        </div>


        {updates.length === 0 ? (

          <EmptyUpdates
            applicationId={application.id}
          />

        ) : (

          <div className="space-y-5">

            {updates.map((update) => (
              <UpdateCard
                key={update.id}
                update={update}
              />
            ))}

          </div>

        )}

      </section>


      {/* FOOTER SPACE */}
      <div className="h-10" />

    </main>
  );
}