"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function CreateUpdatePage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    applicationId: "",
    title: "",
    type: "",
    version: "",
    description: "",
  });

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
      alert("Please fill all fields correctly");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/updates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          applicationId: applicationIdNum,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.log("API ERROR:", err);
        throw new Error(err);
      }

      alert("Update created successfully!");

      setForm({
        applicationId: "",
        title: "",
        type: "",
        version: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating update");
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

          {/* Application ID */}
          <Input
            type="number"
            placeholder="Application ID"
            value={form.applicationId}
            onChange={(e) =>
              setForm({
                ...form,
                applicationId: e.target.value,
              })
            }
          />

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
              <Link href="/dashboard/updates">
                Cancel
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}