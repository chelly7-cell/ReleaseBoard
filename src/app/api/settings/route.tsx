import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/* ----------------------------- Validation ----------------------------- */

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  image: z.string().url().nullable().optional(),
});

/* -------------------------- Get Current User -------------------------- */

async function getCurrentUser(request: NextRequest) {
  try {
    const sessionData = await auth.api.getSession({
      headers: request.headers,
    });

    return sessionData?.user ?? null;
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------------- */
/*                                  GET                                   */
/* ---------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, currentUser.id),
  });

  if (!dbUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: dbUser,
  });
}

/* ---------------------------------------------------------------------- */
/*                                 PATCH                                  */
/* ---------------------------------------------------------------------- */

export async function PATCH(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation error",
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { name, image } = parsed.data;

  const updated = await db
    .update(user)
    .set({
      name,
      image: image ?? null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, currentUser.id))
    .returning();

  return NextResponse.json({
    success: true,
    user: updated[0],
  });
}

/* ---------------------------------------------------------------------- */
/*                                DELETE                                  */
/* ---------------------------------------------------------------------- */

export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db.delete(user).where(eq(user.id, currentUser.id));

  return NextResponse.json({
    success: true,
    message: "Account deleted",
  });
}

/* ---------------------------------------------------------------------- */
/*                                 POST                                  */
/*                    Sign out from all devices                          */
/* ---------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await db.delete(session).where(eq(session.userId, currentUser.id));

  return NextResponse.json({
    success: true,
    message: "Signed out from all devices",
  });
}