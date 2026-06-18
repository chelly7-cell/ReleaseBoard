import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const appId = Number(id);

  if (isNaN(appId)) {
    return NextResponse.json(
      { error: "Invalid application id" },
      { status: 400 }
    );
  }

  const app = await db
    .select()
    .from(applications)
    .where(eq(applications.id, appId))
    .limit(1);

  if (!app.length) {
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 }
    );
  }

  const appUpdates = await db
    .select()
    .from(updates)
    .where(eq(updates.applicationId, appId))
    .orderBy(desc(updates.publishDate));

  return NextResponse.json({
    application: app[0],
    updates: appUpdates,
  });
}