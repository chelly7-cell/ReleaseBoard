import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db"; // your DB
// import { users } from "@/lib/db/schema";

export async function GET() {
  // MOCK user (replace with real auth)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    theme: "dark",
  };

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, theme } = body;

    // TODO: replace with real DB update
    // await db.user.update({
    //   where: { id: userId },
    //   data: { name, email, theme },
    // });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: { name, email, theme },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error updating settings" },
      { status: 500 }
    );
  }
}