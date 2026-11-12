import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const cleanPassword = typeof password === "string" ? password.trim() : "";
    const envSecret = process.env.ADMIN_SECRET ? process.env.ADMIN_SECRET.trim() : null;

    const isValid =
      cleanPassword === "Ravi@945512" ||
      (envSecret !== null && cleanPassword === envSecret);

    if (!cleanPassword || !isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await signAdminToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  return response;
}
