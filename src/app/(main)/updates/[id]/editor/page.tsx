"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import TipTapEditor from "@/components/editor/TipTapEditor";
import { Button } from "@/components/ui/button";

export default function UpdateEditorPage() {
  const { id } = useParams();
  const [update, setUpdate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>(null);

  // Load update
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/updates/${id}`);

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUpdate(data);
        setContent(data.content);
      } catch {
        toast.error("Failed to load update");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // Save
  const handleSave = async (json: any) => {
    setSaving(true);

    try {
      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: json,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Saved successfully");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {update.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Version {update.version}
          </p>
        </div>

        <Button disabled={saving}>
          {saving ? "Saving..." : "Auto Save Ready"}
        </Button>
      </div>

      <TipTapEditor
        initialContent={content}
        onSave={handleSave}
        onChange={(val) => setContent(val)}
      />
    </div>
  );
}