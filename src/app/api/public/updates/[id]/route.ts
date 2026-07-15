import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updateId = Number(id);

    if (!updateId) {
      return NextResponse.json(
        { error: "Invalid update id" },
        { status: 400 }
      );
    }

    const [update] = await db
      .select({
        id: updates.id,
        title: updates.title,
        version: updates.version,
        description: updates.description,
        content: updates.content,
        publishDate: updates.publishDate,
        type: updates.type,
        applicationId: updates.applicationId,

        applicationName: applications.name,
        applicationLogo: applications.logo,
      })
      .from(updates)
      .innerJoin(
        applications,
        eq(updates.applicationId, applications.id)
      )
      .where(
        and(
          eq(updates.id, updateId),
          eq(updates.status, "published")
        )
      )
      .limit(1);

    if (!update) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(update);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}