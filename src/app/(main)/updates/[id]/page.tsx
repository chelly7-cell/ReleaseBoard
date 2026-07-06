import UpdateRenderer from "@/components/editor/UpdateRenderer";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function UpdatePublicPage({
  params,
}: {
  params: { id: string };
}) {
  const updateId = Number(params.id);

  const [update] = await db
    .select()
    .from(updates)
    .where(eq(updates.id, updateId))
    .limit(1);

  if (!update) {
    return (
      <div className="p-10 text-center">
        Update not found
      </div>
    );
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
          {new Date(update.publishDate).toLocaleDateString()}
        </div>
      </div>

      <UpdateRenderer content={update.content} />
    </div>
  );
}
