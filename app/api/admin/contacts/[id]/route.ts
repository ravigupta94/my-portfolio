import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { $set: { read: body.read } },
      { new: true }
    );
    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    return NextResponse.json(contact);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
