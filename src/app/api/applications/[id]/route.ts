import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";
import { parseNumericId, parsePagination } from "@/lib/validations/api";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth(req.headers);
    const { id } = await params;
    const appId = parseNumericId(id);

    if (!appId) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 },
      );
    }

    const [application] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, appId), eq(applications.userId, user.id)))
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const { page, pageSize, offset } = parsePagination(searchParams);

    const appUpdates = await db
      .select()
      .from(updates)
      .where(eq(updates.applicationId, appId))
      .orderBy(desc(updates.publishDate))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({
      application,
      updates: appUpdates,
      page,
      pageSize,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}
