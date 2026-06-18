import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 3. insert user
    const newUser = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
        password: hashedPassword,
      })
      .returning();

    return Response.json({
      message: "User created successfully",
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}