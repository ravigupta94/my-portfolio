import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';

export async function GET() {
  try {
    await connectDB();
    const kb = await KnowledgeBase.findOne();
    if (!kb) {
      return NextResponse.json({ message: 'Knowledge Base not found' }, { status: 404 });
    }
    return NextResponse.json({ data: kb }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Basic auth check using ADMIN_SECRET
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const kb = await KnowledgeBase.findOneAndUpdate({}, body, { new: true, upsert: true });

    return NextResponse.json({ message: 'Knowledge Base updated', data: kb }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update knowledge base' }, { status: 500 });
  }
}
