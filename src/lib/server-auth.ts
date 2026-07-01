import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function getSessionFromHeaders(
  requestHeaders?: Headers,
): Promise<SessionResult> {
  return auth.api.getSession({
    headers: requestHeaders ?? (await headers()),
  });
}

export async function requireAuth(requestHeaders?: Headers): Promise<AuthUser> {
  const session = await getSessionFromHeaders(requestHeaders);

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function getOptionalUser(
  requestHeaders?: Headers,
): Promise<AuthUser | null> {
  const session = await getSessionFromHeaders(requestHeaders);

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}
