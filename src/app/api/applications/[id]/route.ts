import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  analyticsEvents,
  applications,
  updates,
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appId = Number(id);

    if (Number.isNaN(appId) || appId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid application id",
        },
        {
          status: 400,
        }
      );
    }

    // Increment views
    await db
      .update(applications)
      .set({
        views: sql`${applications.views} + 1`,
      })
      .where(eq(applications.id, appId));

    // Analytics event
    await db.insert(analyticsEvents).values({
      applicationId: appId,
      type: "app_view",
    });

    // Application
    const [application] = await db
      .select({
        id: applications.id,
        name: applications.name,
        description: applications.description,
        logo: applications.logo,
        website: applications.website,
        views: applications.views,
        createdAt: applications.createdAt,
      })
      .from(applications)
      .where(eq(applications.id, appId))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        {
          error: "Application not found",
        },
        {
          status: 404,
        }
      );
    }

    // ALL updates (draft + published)
    const appUpdates = await db
      .select({
        id: updates.id,
        applicationId: updates.applicationId,
        title: updates.title,
        version: updates.version,
        description: updates.description,
        status: updates.status,
        type: updates.type,
        content: updates.content,
        publishDate: updates.publishDate,
        createdAt: updates.createdAt,
        views: updates.views,
      })
      .from(updates)
      .where(eq(updates.applicationId, appId))
      .orderBy(desc(updates.createdAt));

    return NextResponse.json({
      application,
      updates: appUpdates,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch application",
      },
      {
        status: 500,
      }
    );
  }
}