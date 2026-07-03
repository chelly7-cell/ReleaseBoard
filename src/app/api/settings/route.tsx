import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name is too long."),

  image: z
    .string()
    .url("Image must be a valid URL.")
    .nullable()
    .optional(),
});

/* -------------------------------------------------------------------------- */
/*                             Helper: Get Session                            */
/* -------------------------------------------------------------------------- */

async function getCurrentUser(request: NextRequest) {
  const sessionData = await auth.api.getSession({
    headers: request.headers,
  });

  if (!sessionData?.user) {
    return null;
  }

  return sessionData.user;
}

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const [dbUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        emailVerified: dbUser.emailVerified,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                  PATCH                                     */
/* -------------------------------------------------------------------------- */

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { name, image } = validation.data;

    const [updatedUser] = await db
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
      message: "Profile updated successfully.",

      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("PATCH SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Delete the user.
    // Because your schema uses onDelete: "cascade",
    // sessions, accounts, applications and updates
    // will be removed automatically.
    await db.delete(user).where(eq(user.id, currentUser.id));

    return NextResponse.json({
      success: true,
      message: "Your account has been deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/*                        Sign Out From All Devices                            */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Remove every session belonging to this user.
    await db
      .delete(session)
      .where(eq(session.userId, currentUser.id));

    return NextResponse.json({
      success: true,
      message: "Signed out from all devices successfully.",
    });
  } catch (error) {
    console.error("SIGN OUT ALL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}