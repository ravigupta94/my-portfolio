import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChatSession from "@/models/ChatSession";

export async function GET() {
  try {
    await connectDB();
    const sessions = await ChatSession.find().sort({ updatedAt: -1 }).limit(200);
    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}