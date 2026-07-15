"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import TipTapEditor from "@/components/editor/TipTapEditor";
import EditorHeader from "@/components/editor/EditorHeader";
import EditorStatus from "@/components/editor/EditorStatus";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorStats from "@/components/editor/EditorStats";
import PublishDialog from "@/components/editor/PublishDialog";

interface Update {
  id: string;
  title: string;
  version: string;
  status: string;
  type?: string;
  publishDate?: string | null;
  content: any;
  applicationId: number;
}

export default function UpdateEditorPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [update, setUpdate] = useState<Update | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    async function loadUpdate() {
      try {
        const res = await fetch(`/api/updates/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load update");
        }

        setUpdate(data);
        setContent(data.content);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load update");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadUpdate();
    }
  }, [id]);

  const saveContent = useCallback(async () => {
    if (!content || !dirty) return true;

    setSaving(true);

    try {
      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setDirty(false);
      setLastSaved(new Date());

      toast.success("Changes saved");

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Save failed");

      return false;
    } finally {
      setSaving(false);
    }
  }, [content, dirty, id]);

  const publishUpdate = async () => {
    if (!update || publishing) return;

    setPublishing(true);

    try {
      console.log("Publishing update:", id);

      if (dirty) {
        const saved = await saveContent();

        if (!saved) {
          throw new Error("Cannot publish. Save failed.");
        }
      }

      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          status: "published",
        }),
      });

      const data = await res.json();

      console.log("Publish response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Publishing failed");
      }

      toast.success("Update published");

      router.push(`/changelog/${update.applicationId}`);
    } catch (error) {
      console.error("Publish error:", error);

      toast.error(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    if (!dirty) return;

    const timer = setTimeout(() => {
      saveContent();
    }, 3000);

    return () => clearTimeout(timer);
  }, [dirty, saveContent]);

  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();

        saveContent();
      }
    }

    window.addEventListener("keydown", shortcut);

    return () => {
      window.removeEventListener("keydown", shortcut);
    };
  }, [saveContent]);

  if (loading || !update) {
    return null;
  }

  const editorText = JSON.stringify(content ?? {});

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <EditorHeader update={update} saving={saving} onSave={saveContent} />

        <PublishDialog
          title={update.title}
          onPublish={publishUpdate}
          disabled={publishing}
        />
      </div>

      <EditorStatus saving={saving} dirty={dirty} lastSaved={lastSaved} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <TipTapEditor
            initialContent={content}
            saving={saving}
            onChange={(value) => {
              setContent(value);
              setDirty(true);
            }}
            onSave={saveContent}
          />

          <EditorStats content={editorText} />
        </div>

        <EditorSidebar update={update} />
      </div>
    </main>
  );
}
