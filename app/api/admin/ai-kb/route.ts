import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import KnowledgeBase from "@/models/KnowledgeBase";

export async function GET() {
  try {
    await connectDB();
    const kb = await KnowledgeBase.findOne();
    return NextResponse.json(kb || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const kb = await KnowledgeBase.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json(kb);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}