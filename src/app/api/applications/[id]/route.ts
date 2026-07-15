import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appId = Number(id);

    if (!appId) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 }
      );
    }

    const [application] = await db
      .select({
        id: applications.id,
        name: applications.name,
        logo: applications.logo,
        views: applications.views,
        description: applications.description,
      })
      .from(applications)
      .where(eq(applications.id, appId))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const appUpdates = await db
      .select({
        id: updates.id,
        applicationId: updates.applicationId,
        title: updates.title,
        version: updates.version,
        description: updates.description,
        type: updates.type,
        content: updates.content,
        status: updates.status,
        publishDate: updates.publishDate,
      })
      .from(updates)
      .where(
        and(
          eq(updates.applicationId, appId),
          eq(updates.status, "published")
        )
      )
      .orderBy(desc(updates.publishDate));

    return NextResponse.json({
      application,
      updates: appUpdates,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch changelog" },
      { status: 500 }
    );
  }
}