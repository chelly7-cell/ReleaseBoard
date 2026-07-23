import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { getGithubReleases } from "@/lib/github";


export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ applicationId:string }>
  }
) {

  try {

    const { applicationId } = await params;

    const id = Number(applicationId);


    const [application] = await db
      .select({
        githubOwner:
          applications.githubOwner,

        githubRepo:
          applications.githubRepo,
      })
      .from(applications)
      .where(
        eq(applications.id,id)
      );


    if (!application) {
      return NextResponse.json(
        {
          error:"Application not found"
        },
        {
          status:404
        }
      );
    }


    if(
      !application.githubOwner ||
      !application.githubRepo
    ){
      return NextResponse.json(
        {
          error:
          "GitHub repository not connected"
        },
        {
          status:400
        }
      );
    }


    const releases =
      await getGithubReleases(
        application.githubOwner,
        application.githubRepo
      );


    return NextResponse.json(
      releases
    );


  } catch(error){

    console.error(error);

    return NextResponse.json(
      {
        error:
        "Failed to fetch releases"
      },
      {
        status:500
      }
    );

  }

}