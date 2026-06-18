"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ApplicationsPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");

  const userId = 1;

  // GET applications
  const loadApplications = async () => {
    const res = await fetch("/api/auth/applications");
    const data = await res.json();
    setApplications(data);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // CREATE application
  const handleCreate = async () => {
    await fetch("/api/auth/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, logo, userId }),
    });

    setName("");
    setLogo("");

    loadApplications();
  };

  return (
    <div className="p-6 space-y-6">
      {/* CREATE */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Application</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Application</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <Input value={logo} onChange={(e) => setLogo(e.target.value)} />
            </div>

            <Button className="w-full" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {app.logo ? (
                  <img
                    src={app.logo}
                    alt={app.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs">
                    No logo
                  </div>
                )}
              <div>
                <p className="font-semibold">{app.name}</p>
                <p className="text-sm text-gray-500">
                  Views: {app.views ?? 0}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                router.push(`/applications/${app.id}`)
              }
            >
              Open
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}