import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";


export async function GET(
  request: Request
) {

  try {

    const { searchParams } = new URL(request.url);

    const applicationId =
      searchParams.get("applicationId");


    if (!applicationId) {

      return NextResponse.json(
        {
          error: "Application id required"
        },
        {
          status: 400
        }
      );

    }


    const latestUpdate = await db
      .select({
        version: updates.version,
      })
      .from(updates)
      .where(
        eq(
          updates.applicationId,
          Number(applicationId)
        )
      )
      .orderBy(
        desc(updates.createdAt)
      )
      .limit(1);



    return NextResponse.json({

      version:
        latestUpdate[0]?.version || null

    });


  } catch(error) {


    console.error(error);


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