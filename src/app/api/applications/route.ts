import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";
import {
  applicationCreateSchema,
  parsePagination,
} from "@/lib/validations/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const { page, pageSize, offset } = parsePagination(searchParams);

    const filters = [
      eq(applications.userId, user.id),
      search ? ilike(applications.name, `%${search}%`) : undefined,
    ].filter(Boolean);

    const where = filters.length === 1 ? filters[0] : and(...filters);

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(applications)
        .where(where)
        .orderBy(desc(applications.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(applications)
        .where(where),
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
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);
    const body = applicationCreateSchema.parse(await req.json());

    const [application] = await db
      .insert(applications)
      .values({
        name: body.name,
        description: body.description || null,
        logo: body.logo || null,
        userId: user.id,
      })
      .returning();

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid application data", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
