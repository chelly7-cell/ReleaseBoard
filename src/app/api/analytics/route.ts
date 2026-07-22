import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  applications,
  updates,
  analyticsEvents,
} from "@/lib/db/schema";

import {
  getAnalyticsRange,
  getStartDate,
} from "@/lib/analytics";

import {
  requireAuth,
  unauthorizedResponse,
} from "@/lib/server-auth";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const searchParams = req.nextUrl.searchParams;

    const range = getAnalyticsRange(
      searchParams.get("range")
    );

    const startDate = getStartDate(range);
  
    const [
      applicationCount,
      updateCount,
      publishedCount,
      draftCount,
      applicationViews,
      updateViews,
      topApplications,
      topUpdates,
      recentApplications,
      viewsOverTime,
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


      // Application Views
      db
        .select({
          views: sql<number>`
            coalesce(sum(${applications.views}),0)::int
          `,
        })
        .from(applications)
        .where(eq(applications.userId, user.id)),


      // Update Views
      db
        .select({
          views: sql<number>`
            coalesce(sum(${updates.views}),0)::int
          `,
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

          views: applications.views,

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
          applications.logo,
          applications.views
        )
        .orderBy(desc(applications.views))
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


      // Recent Applications
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
        /// Views per day
      db
        .select({
          date: sql<string>`
            to_char(
              date_trunc('day', ${analyticsEvents.createdAt}),
              'Mon DD'
            )
          `,
          views: sql<number>`count(*)::int`,
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
          startDate
            ? sql`
                ${applications.userId} = ${user.id}
                AND ${analyticsEvents.createdAt} >= ${startDate}
              `
            : eq(applications.userId, user.id)
        )
        .groupBy(
          sql`
            date_trunc(
              'day',
              ${analyticsEvents.createdAt}
            )
          `
        )
        .orderBy(
          sql`
            date_trunc(
              'day',
              ${analyticsEvents.createdAt}
            )
          `
        ),
    ]);


    const applicationsTotal =
      applicationCount[0]?.count ?? 0;


    const updatesTotal =
      updateCount[0]?.count ?? 0;


    const applicationViewsTotal =
      applicationViews[0]?.views ?? 0;


    const updateViewsTotal =
      updateViews[0]?.views ?? 0;


    const totalViews =
      applicationViewsTotal + updateViewsTotal;


    const averageViews =
      updatesTotal === 0
        ? 0
        : Math.round(totalViews / updatesTotal);


    const isEmpty =
      applicationsTotal === 0 &&
      updatesTotal === 0 &&
      totalViews === 0;

      const chartData =
      viewsOverTime.map((item)=>({
        date:item.date,
        views:item.views,
      }));
      
   return NextResponse.json({

      range,

      isEmpty,

      chartData,

      overview: {

        applications: applicationsTotal,

        updates: updatesTotal,

        published:
          publishedCount[0]?.count ?? 0,

        drafts:
          draftCount[0]?.count ?? 0,

        applicationViews:
          applicationViewsTotal,

        updateViews:
          updateViewsTotal,

        totalViews,

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