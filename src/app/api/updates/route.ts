import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";
import {
  parseNumericId,
  parsePagination,
  updateCreateSchema,
} from "@/lib/validations/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const { searchParams } = new URL(req.url);
    const requestedApplicationId = searchParams.get("applicationId");
    const applicationId = requestedApplicationId
      ? parseNumericId(requestedApplicationId)
      : null;

    if (requestedApplicationId && !applicationId) {
      return NextResponse.json(
        { error: "Invalid application id" },
        { status: 400 },
      );
    }

    const { page, pageSize, offset } = parsePagination(searchParams);
    const ownershipFilter = applicationId
      ? and(
          eq(applications.userId, user.id),
          eq(applications.id, applicationId),
        )
      : eq(applications.userId, user.id);

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: updates.id,
          title: updates.title,
          version: updates.version,
          status: updates.status,
          views: updates.views,
          createdAt: updates.createdAt,
          publishDate: updates.publishDate,
          type: updates.type,
          description: updates.description,
          applicationId: updates.applicationId,
          applicationName: applications.name,
          applicationLogo: applications.logo
        })
        .from(updates)
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(ownershipFilter)
        .orderBy(desc(updates.publishDate))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(updates)
        .innerJoin(applications, eq(updates.applicationId, applications.id))
        .where(ownershipFilter),
    ]);

    return NextResponse.json({
      items,
      page,
      pageSize,
      total: totalResult[0]?.count ?? 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const body = updateCreateSchema.parse(await req.json());

    const [application] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(
        and(
          eq(applications.id, body.applicationId),
          eq(applications.userId, user.id),
        ),
      )
      .limit(1);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const [inserted] = await db
      .insert(updates)
      .values({
        applicationId: body.applicationId,
        title: body.title,
        description: body.description,
        version: body.version,
        type: body.type,
        status: body.status,
        publishDate: body.publishDate,
      })
      .returning();

    await db
      .update(applications)
      .set({ updatesCount: sql`${applications.updatesCount} + 1` })
      .where(eq(applications.id, body.applicationId));

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid update data", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create update" },
      { status: 500 },
    );
  }
}
