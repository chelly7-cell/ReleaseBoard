"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
interface Update {
  id: number;
  title: string;
  version: string;
  status: string;
  createdAt: string;
  applicationName: string;
  applicationLogo: string;
}

type UpdatesResponse = {
  items: Update[];
  page: number;
  pageSize: number;
  total: number;
}

export default function UpdatesPage() {
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/updates");

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Unable to load updates");
        }

        const data = (await res.json()) as UpdatesResponse;
        setUpdates(data.items);
      } catch (err) {
        console.error(err);
        setError("Unable to load updates. Please try again.");
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Updates</h1>

        <Button asChild>
          <Link href="/updates/new">
            Create Update
          </Link>
        </Button>
      </div>

      {/* Content */}
      {error ? (
        <Card className="p-6 text-center text-destructive">
          {error}
        </Card>
      ) : loading ? (
        <p>Loading...</p>
      ) : updates.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          No updates found
        </Card>
      ) : (
        
        <div className="space-y-3">
          {updates.map((u) => (
            <Card
              key={u.id}
              className="p-4 flex justify-between items-center"
            >
              
              <div className="flex items-center gap-4">
                <Image
                  src={u.applicationLogo}
                  alt={u.applicationName}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl border object-cover"
                />

                <div>
                  <h2 className="font-semibold">{u.title}</h2>

                  <p className="text-sm text-muted-foreground">
                    {u.applicationName} · Version {u.version}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge>{u.status}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
