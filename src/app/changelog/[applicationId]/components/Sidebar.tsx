import Link from "next/link";

interface Update {
  id: number;
  applicationId: number;
  title: string;
  version: string;
}

export default function Sidebar({
  updates,
}: {
  updates: Update[];
}) {
  return (
    <div className="sticky top-20 space-y-4">
      <h3 className="text-sm font-semibold">
        Releases
      </h3>

      <div className="rounded-xl border p-4 space-y-3">
        {updates.map((update) => (
          <Link
            key={update.id}
            href={`/changelog/${update.applicationId}/release/${update.id}`}
            className="block rounded-md px-2 py-2 transition hover:bg-muted"
          >
            <div className="font-medium">
              {update.title}
            </div>

            <div className="text-sm text-muted-foreground">
              v{update.version}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}