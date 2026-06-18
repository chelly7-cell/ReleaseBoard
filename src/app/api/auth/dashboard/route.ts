import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    const apps = await db.select().from(applications);

    const recentUpdates = await db
      .select({
        id: updates.id,
        title: updates.title,
        version: updates.version,
        status: updates.status,
        views: updates.views,
        createdAt: updates.createdAt,
        applicationId: updates.applicationId,
        applicationName: applications.name,
      })
      .from(updates)
      .leftJoin(
        applications,
        sql`${updates.applicationId} = ${applications.id}`
      )
      .orderBy(desc(updates.createdAt))
      .limit(5);

    const totalViews = await db
      .select({
        views: sql<number>`coalesce(sum(${updates.views}),0)`,
      })
      .from(updates);

    return NextResponse.json({
      applications: apps.length,
      updates: recentUpdates.length,
      views: totalViews[0].views,
      recentUpdates,
    });
  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      message: error.message,
      cause: error.cause,
    },
    { status: 500 }
  );
}
}