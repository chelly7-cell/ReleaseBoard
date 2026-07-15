"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ReadOnlyEditor from "@/components/changelog/ReadOnlyEditor";

interface Release {
  id: number;
  title: string;
  version: string;
  description: string;
  content: any;
  publishDate: string;
  type: string;
  applicationId: number;
  applicationName: string;
  applicationLogo: string | null;
}

export default function ReleasePage() {
  const { applicationId, updateId } = useParams();

  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelease() {
      try {
        const res = await fetch(`/api/public/updates/${updateId}`);

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();

        setRelease(data);
      } finally {
        setLoading(false);
      }
    }

    loadRelease();
  }, [updateId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading release...
      </div>
    );
  }

  if (!release) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Release not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <Link
          href={`/changelog/${applicationId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to changelog
        </Link>

        <div className="mb-8 rounded-xl border bg-card p-8">

          <div className="flex items-center gap-4">

            {release.applicationLogo ? (
              <img
                src={release.applicationLogo}
                alt={release.applicationName}
                className="h-12 w-12 rounded-xl"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-lg font-bold">
                {release.applicationName[0]}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold">
                {release.title}
              </h1>

              <p className="mt-2 text-muted-foreground">
                Version {release.version}
              </p>
            </div>

          </div>

          <p className="mt-6 text-muted-foreground">
            {release.description}
          </p>

        </div>

        <div className="rounded-xl border bg-card p-8">
          <ReadOnlyEditor
            content={release.content}
          />
        </div>

      </div>
    </main>
  );
}