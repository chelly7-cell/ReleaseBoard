"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Application = {
  id: number;
  name: string;
};

type ApplicationsResponse = {
  items: Application[];
};

export default function CreateUpdatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  const [form, setForm] = useState({
    applicationId: "",
    title: "",
    type: "",
    version: "",
    description: "",
  });

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications?pageSize=50");

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
        toast.error("Unable to load applications");
      } finally {
        setLoadingApplications(false);
      }
    }

    loadApplications();
  }, [router]);

  const handleSubmit = async () => {
    const applicationIdNum = Number(form.applicationId);

    if (
      isNaN(applicationIdNum) ||
      applicationIdNum <= 0 ||
      !form.title.trim() ||
      !form.type ||
      !form.version.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          applicationId: applicationIdNum,
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Unable to create update");
      }

      toast.success("Update created successfully");

      setForm({
        applicationId: "",
        title: "",
        type: "",
        version: "",
        description: "",
      });

      router.push("/updates");
    } catch (err) {
      console.error(err);
      toast.error("Error creating update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Update</CardTitle>
          <CardDescription>
            Publish a new application update
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <Select
            value={form.applicationId}
            disabled={loadingApplications}
            onValueChange={(value) =>
              setForm({
                ...form,
                applicationId: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingApplications
                    ? "Loading applications..."
                    : "Select application"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {applications.map((application) => (
                <SelectItem
                  key={application.id}
                  value={String(application.id)}
                >
                  {application.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Title */}
          <Input
            placeholder="Update title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* Type */}
          <Select
            value={form.type}
            onValueChange={(value) =>
              setForm({ ...form, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select update type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fix">Bug Fix</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="improvement">
                Improvement
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Version */}
          <Input
            placeholder="Version (e.g. 1.0.1)"
            value={form.version}
            onChange={(e) =>
              setForm({ ...form, version: e.target.value })
            }
          />

          {/* Description */}
          <Textarea
            placeholder="Describe what changed..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Update"}
            </Button>

            <Button asChild variant="outline">
              <Link href="/updates">
                Cancel
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
