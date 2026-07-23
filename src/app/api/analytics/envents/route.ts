import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.insert(analyticsEvents).values({
      applicationId: body.applicationId,
      updateId: body.updateId ?? null,
      type: body.type,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("ANALYTICS EVENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to save analytics event",
      },
      {
        status: 500,
      },
    );
  }
}