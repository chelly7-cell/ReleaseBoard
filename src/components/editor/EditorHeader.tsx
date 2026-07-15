"use client";

import { Save, Loader2, Upload, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Update {
  title: string;
  version: string;
  status: string;
}

interface EditorHeaderProps {
  update: Update;
  saving: boolean;
  onSave: () => void;
}

export default function EditorHeader({
  update,
  saving,
  onSave,
}: EditorHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between">
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="px-0 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            {update.title}
          </h1>

          <Badge>
            {update.status}
          </Badge>
        </div>

        <p className="text-muted-foreground">
          Version {update.version}
        </p>
      </div>

      <div className="flex gap-3">
        

        <Button
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </header>
  );
}