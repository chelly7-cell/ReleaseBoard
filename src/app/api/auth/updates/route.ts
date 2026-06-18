import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    let data;

    if (applicationId) {
      data = await db
        .select()
        .from(updates)
        .where(eq(updates.applicationId, Number(applicationId)))
        .orderBy(desc(updates.publishDate));
    } else {
      data = await db
        .select()
        .from(updates)
        .orderBy(desc(updates.publishDate));
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("FULL ERROR:", error);
    console.error("CAUSE:", error?.cause);

    return NextResponse.json(
      {
        error: "Server Error",
        details:
          error?.cause?.message ||
          error?.message ||
          String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      applicationId,
      title,
      description,
      version,
      type,
      status,
      publishDate,
    } = body;

    if (
      !applicationId ||
      !title ||
      !description ||
      !version ||
      !type
    ) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(updates)
      .values({
        applicationId: Number(applicationId),
        title,
        description,
        version,
        type,
        status: status || "published",
        publishDate: publishDate
          ? new Date(publishDate)
          : new Date(),
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (error: any) {
    console.error("FULL ERROR:", error);
    console.error("CAUSE:", error?.cause);

    return NextResponse.json(
      {
        error: "Server Error",
        details:
          error?.cause?.message ||
          error?.message ||
          String(error),
      },
      { status: 500 }
    );
  }
}