import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { updates, analyticsEvents } from "@/lib/db/schema";

export const dynamic = "force-dynamic";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const updateId = Number(id);


    if (
      Number.isNaN(updateId) ||
      updateId <= 0
    ) {

      return NextResponse.json(
        {
          error:"Invalid update id",
        },
        {
          status:400,
        }
      );

    }


    // Get update information
    const [update] = await db
      .select({
        id: updates.id,
        applicationId: updates.applicationId,
      })
      .from(updates)
      .where(
        eq(updates.id, updateId)
      )
      .limit(1);


    if(!update){

      return NextResponse.json(
        {
          error:"Update not found",
        },
        {
          status:404,
        }
      );

    }



    // Increment update views
    await db
      .update(updates)
      .set({
        views: sql`${updates.views} + 1`,
      })
      .where(
        eq(updates.id, updateId)
      );



    // Track analytics event
    await db.insert(analyticsEvents)
      .values({

        applicationId:update.applicationId,

        updateId:update.id,

        type:"update_view",

      });



    return NextResponse.json({
      success:true,
    });


  } catch(error){

    console.error(error);


    return NextResponse.json(
      {
        error:"Failed to update views",
      },
      {
        status:500,
      }
    );

  }

}