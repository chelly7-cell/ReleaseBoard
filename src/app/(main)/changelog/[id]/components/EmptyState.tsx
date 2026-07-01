import { Sparkles } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="border rounded-xl p-16 text-center">
      <Sparkles className="mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold">No releases yet</h3>
      <p className="text-muted-foreground mt-2">
        Create your first release to get started
      </p>
    </div>
  );
}