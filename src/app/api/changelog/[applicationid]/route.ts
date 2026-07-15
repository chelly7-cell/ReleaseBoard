import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates } from "@/lib/db/schema";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ applicationid: string }> }
) {
  try {

    const { applicationid } = await params;

    const appId = Number(applicationid);


    const application = await db.query.applications.findFirst({
      where: eq(applications.id, appId),
      columns: {
        id: true,
        name: true,
        logo: true,
        views: true,
      },
    });


    if (!application) {
      return NextResponse.json(
        {
          error: "Application not found",
        },
        {
          status:404,
        }
      );
    }


    const publicUpdates = await db
      .select({
        id: updates.id,
        applicationId: updates.applicationId,
        title: updates.title,
        version: updates.version,
        status: updates.status,
        content: updates.content,
        publishDate: updates.publishDate,
        type: updates.type,
      })
      .from(updates)
      .where(
        and(
          eq(updates.applicationId, appId),
          eq(updates.status,"published")
        )
      );


    return NextResponse.json({
      application,
      updates: publicUpdates,
    });


  } catch(error){

    return NextResponse.json(
      {
        error:"Server error"
      },
      {
        status:500
      }
    );

  }
}