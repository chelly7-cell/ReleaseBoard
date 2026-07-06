import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";
import {
  requireAuth,
  unauthorizedResponse,
} from "@/lib/server-auth";

export const dynamic = "force-dynamic";

// GET UPDATE

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req.headers);

    const { id } = await params;

    const updateId = Number(id);

    const [update] = await db
      .select({
        id: updates.id,
        title: updates.title,
        version: updates.version,
        description: updates.description,
        type: updates.type,
        status: updates.status,
        content: updates.content,
        publishDate: updates.publishDate,
        applicationId: updates.applicationId,
      })
      .from(updates)
      .innerJoin(
        applications,
        eq(updates.applicationId, applications.id)
      )
      .where(
        and(
          eq(updates.id, updateId),
          eq(applications.userId, user.id)
        )
      )
      .limit(1);

    if (!update) {
      return NextResponse.json(
        {
          error: "Update not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(update);
  } catch {
    return unauthorizedResponse();
  }
}

// PATCH

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req.headers);

    const { id } = await params;

    const updateId = Number(id);

    const body = await req.json();

    const [exists] = await db
      .select({
        id: updates.id,
      })
      .from(updates)
      .innerJoin(
        applications,
        eq(updates.applicationId, applications.id)
      )
      .where(
        and(
          eq(updates.id, updateId),
          eq(applications.userId, user.id)
        )
      )
      .limit(1);

    if (!exists) {
      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        }
      );
    }

    const [updated] = await db
      .update(updates)
      .set({
        title: body.title,
        version: body.version,
        description: body.description,
        content: body.content,
        status: body.status,
        type: body.type,
      })
      .where(eq(updates.id, updateId))
      .returning();

    return NextResponse.json(updated);
  } catch {
    return unauthorizedResponse();
  }
}

// DELETE

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req.headers);

    const { id } = await params;

    const updateId = Number(id);

    const [exists] = await db
      .select({
        id: updates.id,
      })
      .from(updates)
      .innerJoin(
        applications,
        eq(updates.applicationId, applications.id)
      )
      .where(
        and(
          eq(updates.id, updateId),
          eq(applications.userId, user.id)
        )
      )
      .limit(1);

    if (!exists) {
      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        }
      );
    }

    await db
      .delete(updates)
      .where(eq(updates.id, updateId));

    return NextResponse.json({
      success: true,
    });
  } catch {
    return unauthorizedResponse();
  }
}