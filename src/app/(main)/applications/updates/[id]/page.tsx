import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";

interface UpdatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdatePage({
  params,
}: UpdatePageProps) {
  const { id } = await params;

  const updateId = Number(id);

  if (!Number.isInteger(updateId) || updateId <= 0) {
    notFound();
  }

  const [update] = await db
    .select()
    .from(updates)
    .where(eq(updates.id, updateId))
    .limit(1);

  if (!update) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="space-y-2 border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {update.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          Version {update.version}
        </p>
      </header>

      <section className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <p>{update.description}</p>
      </section>
    </main>
  );
}