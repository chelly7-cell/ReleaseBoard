import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, updates ,subscribers  } from "@/lib/db/schema";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";
import { github } from "@/lib/github";
import { resend } from "@/lib/email";

export const dynamic = "force-dynamic";

// GET UPDATE

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
      .innerJoin(applications, eq(updates.applicationId, applications.id))
      .where(and(eq(updates.id, updateId), eq(applications.userId, user.id)))
      .limit(1);

    if (!update) {
      return NextResponse.json(
        {
          error: "Update not found",
        },
        {
          status: 404,
        },
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
  { params }: { params: Promise<{ id: string }> },
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
      .innerJoin(applications, eq(updates.applicationId, applications.id))
      .where(and(eq(updates.id, updateId), eq(applications.userId, user.id)))
      .limit(1);

    if (!exists) {
      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        },
      );
    }

    const [updated] = await db
      .update(updates)
      .set({
        ...(body.title && {
          title: body.title,
        }),

        ...(body.version && {
          version: body.version,
        }),

        ...(body.description && {
          description: body.description,
        }),

        ...(body.content && {
          content: body.content,
        }),

        ...(body.status && {
          status: body.status,
        }),

        ...(body.type && {
          type: body.type,
        }),

        ...(body.publishDate && {
          publishDate: body.publishDate,
        }),
      })
      .where(eq(updates.id, updateId))
      .returning();
      if(body.status === "published") {

const [application] =
await db
.select()
.from(applications)
.where(
 eq(
 applications.id,
 updated.applicationId
 )
)
.limit(1);


if(
 application.githubOwner &&
 application.githubRepo
){

try {

await github.repos.createRelease({

owner: application.githubOwner,

repo: application.githubRepo,

tag_name:`v${updated.version}`,

name:updated.title,

body:updated.description,

});

} catch(error){

console.error(
"GitHub release failed",
error
);

}

}


// send emails

const appSubscribers =
await db
.select()
.from(subscribers)
.where(
 eq(
 subscribers.applicationId,
 application.id
 )
);


for(
const subscriber of appSubscribers
){

await resend.emails.send({

from:
"ReleaseBoard <onboarding@resend.dev>",

to:
subscriber.email,

subject:
`${updated.title} released`,

html:
`
<h2>
${updated.title}
</h2>

<p>
${updated.description}
</p>

<a href="http://localhost:3000/changelog/${application.id}">
Read changelog
</a>
`

});

}

}

    return NextResponse.json(updated);
  } catch (error) {
    console.log(error);
    return unauthorizedResponse();
  }
}

// DELETE

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
      .innerJoin(applications, eq(updates.applicationId, applications.id))
      .where(and(eq(updates.id, updateId), eq(applications.userId, user.id)))
      .limit(1);

    if (!exists) {
      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        },
      );
    }

    await db.delete(updates).where(eq(updates.id, updateId));

    return NextResponse.json({
      success: true,
    });
  } catch {
    return unauthorizedResponse();
  }
}
