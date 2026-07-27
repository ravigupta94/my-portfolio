import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET() {
  try {
    await connectDB();
    const company = await Company.findOne({});
    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error('Company GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
}
