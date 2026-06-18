"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Update {
  id: number;
  title: string;
  version: string;
  status: string;
  createdAt: string;
}

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {
      try {
        const res = await fetch("/api/auth/updates");
        const data = await res.json();

        setUpdates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Updates</h1>

        <Button asChild>
          <Link href="/dashboard/updates/new">
            Create Update
          </Link>
        </Button>
      </div>

      {/* Content */}
      {loading ? (
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
              <div>
                <h2 className="font-semibold">{u.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Version: {u.version}
                </p>
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