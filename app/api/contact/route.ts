import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    await connectDB();

    const contact = await Contact.create({ name, email, message });

    return NextResponse.json({
      success: true,
      message: "Message received! Ravi will get back to you shortly.",
      id: contact._id,
    });
  } catch (error: any) {
    console.error('Contact POST error:', error);
    const msg = error?.message || '';
    const isDbError =
      msg.includes('whitelist') ||
      msg.includes('ServerSelectionError') ||
      msg.includes('buffering timed out') ||
      msg.includes('ECONNREFUSED');

    return NextResponse.json(
      {
        success: false,
        error: isDbError
          ? 'Database connection issue. Please ensure MongoDB Atlas IP access 0.0.0.0/0 is enabled, or email directly.'
          : 'Failed to send message. Please try again.',
      },
      { status: 500 }
    );
  }
}
