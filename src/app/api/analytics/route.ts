import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import {
  requireAuth,
  unauthorizedResponse,
} from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);

    const [
      applicationCount,
      updateCount,
      publishedCount,
      draftCount,
      totalViews,
      topApplications,
      topUpdates,
      recentApplications,
    ] = await Promise.all([
      // Total Applications
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(applications)
        .where(eq(applications.userId, user.id)),

      // Total Updates
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(updates)
        .innerJoin(
          applications,
          eq(updates.applicationId, applications.id)
        )
        .where(eq(applications.userId, user.id)),

      // Published Updates
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(updates)
        .innerJoin(
          applications,
          eq(updates.applicationId, applications.id)
        )
        .where(
          sql`${applications.userId} = ${user.id}
          AND ${updates.status} = 'published'`
        ),

      // Draft Updates
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(updates)
        .innerJoin(
          applications,
          eq(updates.applicationId, applications.id)
        )
        .where(
          sql`${applications.userId} = ${user.id}
          AND ${updates.status} != 'published'`
        ),

      // Total Views
      db
        .select({
          views:
            sql<number>`coalesce(sum(${updates.views}),0)::int`,
        })
        .from(updates)
        .innerJoin(
          applications,
          eq(updates.applicationId, applications.id)
        )
        .where(eq(applications.userId, user.id)),

      // Top Applications
      db
        .select({
          id: applications.id,
          name: applications.name,
          logo: applications.logo,

          totalViews:
            sql<number>`coalesce(sum(${updates.views}),0)::int`,

          updatesCount:
            sql<number>`count(${updates.id})::int`,
        })
        .from(applications)
        .leftJoin(
          updates,
          eq(applications.id, updates.applicationId)
        )
        .where(eq(applications.userId, user.id))
        .groupBy(
          applications.id,
          applications.name,
          applications.logo
        )
        .orderBy(
          sql`coalesce(sum(${updates.views}),0) DESC`
        )
        .limit(5),

      // Top Updates
      db
        .select({
          id: updates.id,
          title: updates.title,
          version: updates.version,
          status: updates.status,
          views: updates.views,
          createdAt: updates.createdAt,
          applicationName: applications.name,
        })
        .from(updates)
        .innerJoin(
          applications,
          eq(updates.applicationId, applications.id)
        )
        .where(eq(applications.userId, user.id))
        .orderBy(desc(updates.views))
        .limit(5),

      // Latest Applications
      db
        .select({
          id: applications.id,
          name: applications.name,
          logo: applications.logo,
          createdAt: applications.createdAt,
          views: applications.views,
          updatesCount: applications.updatesCount,
        })
        .from(applications)
        .where(eq(applications.userId, user.id))
        .orderBy(desc(applications.createdAt))
        .limit(5),
    ]);

    const applicationsTotal =
      applicationCount[0]?.count ?? 0;

    const updatesTotal =
      updateCount[0]?.count ?? 0;

    const viewsTotal =
      totalViews[0]?.views ?? 0;

    const averageViews =
      updatesTotal === 0
        ? 0
        : Math.round(viewsTotal / updatesTotal);
    
    const isEmpty =
      applicationsTotal === 0 &&
      updatesTotal === 0 &&
      viewsTotal === 0;

    return NextResponse.json({
  isEmpty,

  overview: {
    applications: applicationsTotal,
    updates: updatesTotal,
    published: publishedCount[0]?.count ?? 0,
    drafts: draftCount[0]?.count ?? 0,
    totalViews: viewsTotal,
    averageViews,
  },

  topApplications,
  topUpdates,
  recentApplications,
});
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      {
        error: "Failed to load analytics.",
      },
      {
        status: 500,
      }
    );
  }
}