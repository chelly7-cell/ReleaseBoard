export default function Stats({ app, updates }: any) {
  return (
    <div className="sticky top-20 space-y-6">

      <div className="border rounded-xl p-4 space-y-2">
        <div className="text-sm font-semibold">Overview</div>

        <div className="text-sm text-muted-foreground">
          👁 {app.views} Views
        </div>

        <div className="text-sm text-muted-foreground">
          📦 {updates.length} Releases
        </div>

        <div className="text-sm text-muted-foreground">
          🔒 Public
        </div>
      </div>

      <div className="border rounded-xl p-4 space-y-2">
        <div className="text-sm font-semibold">On this page</div>

        <div className="text-sm text-muted-foreground space-y-1">
          <div>Overview</div>
          <div>Releases</div>
          <div>Changelog</div>
        </div>
      </div>

    </div>
  );
}