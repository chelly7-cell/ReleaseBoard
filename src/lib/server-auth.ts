import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};


export async function getSessionFromHeaders(
  requestHeaders?: Headers,
) {
  return auth.api.getSession({
    headers: requestHeaders ?? (await headers()),
  });
}

export async function requireAuth(requestHeaders?: Headers) {
  const session = await getSessionFromHeaders(requestHeaders);

  if(!session){
    throw new Error("UNAUTHORIZED");
  }
  return session.user
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
