"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);

  // load app + updates
  const loadData = async () => {
    const res = await fetch(`/api/auth/applications/${id}`);
    const data = await res.json();

    setApp(data.application);
    setUpdates(data.updates);
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  if (!app) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <img src={app.logo} className="w-10 h-10 rounded" />
            {app.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4">
          <p>Views: {app.views ?? 0}</p>
          <p>Updates: {updates.length}</p>

          <Button>Create Update</Button>
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