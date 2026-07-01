import { Badge } from "@/components/ui/badge";

export default function ReleaseCard({ update }: any) {
  return (
    <article className="relative border-l pl-6">

      {/* dot */}
      <div className="absolute -left-2 top-2 h-3 w-3 rounded-full bg-foreground" />

      <div className="space-y-3">

        <div className="flex items-center gap-2">
          <Badge variant="secondary">v{update.version}</Badge>
          <Badge>{update.status}</Badge>
        </div>

        <h2 className="text-2xl font-bold tracking-tight">
          {update.title}
        </h2>

        <p className="text-muted-foreground leading-7">
          This is where Markdown or Tiptap content will be rendered.
          Later this becomes your real changelog system.
        </p>

      </div>

    </article>
  );
}