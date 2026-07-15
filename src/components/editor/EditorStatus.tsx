"use client";

import { CheckCircle, Loader2 } from "lucide-react";

interface EditorStatusProps {
  saving: boolean;
  dirty: boolean;
  lastSaved: Date | null;
}

export default function EditorStatus({
  saving,
  dirty,
  lastSaved,
}: EditorStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {saving && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      )}

      {!saving && dirty && (
        <>
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          Unsaved changes
        </>
      )}

      {!saving && !dirty && lastSaved && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          Saved {lastSaved.toLocaleTimeString()}
        </>
      )}

      {!saving && !dirty && !lastSaved && (
        <>
          <CheckCircle className="h-4 w-4" />
          Ready
        </>
      )}
    </div>
  );
}