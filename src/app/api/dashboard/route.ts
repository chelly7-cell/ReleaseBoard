import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql ,and,gte} from "drizzle-orm";
import { db } from "@/lib/db";
import { applications, updates, analyticsEvents } from "@/lib/db/schema";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const traffic =
    await db
    .select({

    date:
    sql<string>`
    DATE(${analyticsEvents.createdAt})
    `,

    views:
    sql<number>`
    count(*)::int
    `

    })
    .from(analyticsEvents)
    .innerJoin(
    applications,
    eq(
      analyticsEvents.applicationId,
      applications.id
    )
    )
    .where(
    and(

    eq(
    applications.userId,
    user.id
    ),

    eq(
    analyticsEvents.type,
    "changelog_view"
    ),

    gte(
    analyticsEvents.createdAt,
    new Date(
    Date.now()
    -
    14*24*60*60*1000
    )
    )

    )
    )
    .groupBy(
    sql`
    DATE(${analyticsEvents.createdAt})
    `
    )
    .orderBy(
    sql`
    DATE(${analyticsEvents.createdAt})
    `
    );
    const [
      applicationCount,
      updateCount,
      totalViews,
      recentUpdates,
      publishedCount,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(applications)
        .where(eq(applications.userId, user.id)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(updates)
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(eq(applications.userId, user.id)),
      db
        .select({ views: sql<number>`coalesce(sum(${updates.views}), 0)::int` })
        .from(updates)
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(eq(applications.userId, user.id)),
      db
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
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(eq(applications.userId, user.id))
        .orderBy(desc(updates.createdAt))
        .limit(5),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(updates)
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(
          sql`${applications.userId} = ${user.id} and ${updates.status} = 'published'`,
        ),
    ]);

    return NextResponse.json({
      applications: applicationCount[0]?.count ?? 0,
      updates: updateCount[0]?.count ?? 0,
      views: totalViews[0]?.views ?? 0,
      published: publishedCount[0]?.count ?? 0,
      recentUpdates,
      analytics:traffic
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 },
    );
  }
}
