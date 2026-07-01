export default function Sidebar({ updates }: any) {
  return (
    <div className="sticky top-20 space-y-4">

      <div className="text-sm font-semibold text-muted-foreground">
        Releases
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        {updates.map((u: any) => (
          <div
            key={u.id}
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition"
          >
            ● v{u.version}
          </div>
        ))}
      </div>

    </div>
  );
}