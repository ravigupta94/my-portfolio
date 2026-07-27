import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ category: 1, order: 1 });
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Skills GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}
