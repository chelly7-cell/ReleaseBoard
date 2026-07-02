import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 🔒 validation
const settingsSchema = z.object({
  userId: z.string(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  theme: z.enum(["light", "dark"]),
});

// 🟢 GET SETTINGS (REAL DB)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: foundUser[0].name,
        email: foundUser[0].email,
        theme: "light", // ⚠️ not in schema yet (can be added later)
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// 🟡 UPDATE SETTINGS (REAL DB)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { userId, name, email } = parsed.data;

    const updated = await db
      .update(user)
      .set({
        name,
        email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        name: updated[0].name,
        email: updated[0].email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}