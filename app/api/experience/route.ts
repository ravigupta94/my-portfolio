import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Experience from '@/models/Experience';

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find({}).sort({ order: 1 });
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    console.error('Experience GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}
