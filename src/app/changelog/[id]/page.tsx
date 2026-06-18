import { notFound } from "next/navigation";
import { db } from "@/lib/db/db";
import { updates, applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await db
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
    .where(eq(updates.id, Number(id)))
    .limit(1);

  const update = result[0];

  if (!update) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="mb-8">
        <span className="rounded-full border px-3 py-1 text-sm">
          {update.version}
        </span>

        <p className="mt-4 text-sm text-muted-foreground">
          {update.appName}
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          {update.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {update.publishDate?.toLocaleDateString()}
        </p>
      </div>

      <div className="rounded-xl border p-8">
        <div className="mb-4">
          <span className="rounded bg-muted px-3 py-1 text-sm">
            {update.type}
          </span>
        </div>

        <p className="whitespace-pre-wrap leading-8">
          {update.description}
        </p>
      </div>
    </div>
  );
}