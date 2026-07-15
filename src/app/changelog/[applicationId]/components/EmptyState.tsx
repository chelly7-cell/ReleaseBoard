import { Sparkles } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border p-16 text-center">
      <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />

      <h3 className="mt-4 text-xl font-semibold">
        No releases yet
      </h3>

      <p className="mt-2 text-muted-foreground">
        This application has not published any updates.
      </p>
    </div>
  );
}