import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const body = await req.json();


const user = await db
  .select()
  .from(users)
  .where(eq(users.email, body.email))
  .limit(1);

if (user.length === 0) {
  return NextResponse.json(
    { error: "User not found" },
    { status: 404 }
  );
}

const dbUser = user[0];

const passwordMatch = await bcrypt.compare(
  body.password,
  dbUser.password
);

if (!passwordMatch) {
  return NextResponse.json(
    { error: "Wrong password" },
    { status: 401 }
  );
}

const response = NextResponse.json({
  message: "Login success",
  user: {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
  },
});

response.cookies.set("userId", String(dbUser.id), {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
});

return response;

} catch (error) {
console.error(error);


return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
);


}
}
