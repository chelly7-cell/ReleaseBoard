import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req.headers);

    return NextResponse.json({
      ...user,
      image:
        user.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.name || user.email,
        )}&background=random`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorizedResponse();
    }

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
