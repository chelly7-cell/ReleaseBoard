import Link from "next/link";
import { db } from "@/lib/db/db";
import { updates, applications } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function ChangelogPage() {
  const changelog = await db
    .select({
      id: updates.id,
      title: updates.title,
      description: updates.description,
      version: updates.version,
      type: updates.type,
      publishDate: updates.publishDate,
      appName: applications.name,
    })
    .from(updates)
    .leftJoin(
      applications,
      eq(updates.applicationId, applications.id)
    )
    .where(eq(updates.status, "published"))
    .orderBy(desc(updates.publishDate));

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <p className="text-muted-foreground mt-2">
          Latest product updates from all applications.
        </p>
      </div>

      <div className="space-y-6">
        {changelog.map((update) => (
          <Link
            key={update.id}
            href={`/changelog/${update.id}`}
          >
            <div className="rounded-xl border p-6 hover:bg-muted/50 transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full border px-3 py-1 text-sm">
                  {update.version}
                </span>

                <span className="text-sm text-muted-foreground">
                  {update.appName}
                </span>
              </div>

              <h2 className="text-xl font-semibold">
                {update.title}
              </h2>

              <p className="text-muted-foreground mt-2 line-clamp-2">
                {update.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{update.type}</span>

                <span>
                  {update.publishDate?.toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}