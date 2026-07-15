import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import UpdateRenderer from "@/components/editor/UpdateRenderer";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function UpdatePublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const updateId = Number(id);

  if (Number.isNaN(updateId)) {
    notFound();
  }

  const [update] = await db
    .select()
    .from(updates)
    .where(eq(updates.id, updateId))
    .limit(1);
    
  console.log(JSON.stringify(update?.content, null, 2));

  if (!update) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-muted-foreground">
          Version {update.version}
        </p>

        <h1 className="text-4xl font-bold mt-2">
          {update.title}
        </h1>

        <p className="text-muted-foreground mt-3">
          {update.description}
        </p>

        <div className="text-xs text-muted-foreground mt-4">
          {update.publishDate
            ? new Date(update.publishDate).toLocaleDateString()
            : "Not published"}
        </div>
      </div>

      <UpdateRenderer content={update.content} />
    </div>
  );
}