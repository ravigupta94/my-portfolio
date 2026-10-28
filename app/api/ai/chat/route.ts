import { NextResponse } from 'next/server';
import dns from 'dns';
import { connectDB } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';
import ChatSession from '@/models/ChatSession';
import { buildSystemPrompt } from '@/lib/systemPrompt';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !sessionId) {
      return NextResponse.json({ error: 'Messages and sessionId are required' }, { status: 400 });
    }

    let kb = null;
    try {
      await connectDB();
      kb = await KnowledgeBase.findOne();
    } catch (dbError) {
      console.warn('MongoDB connection/query warning in chat route, using default KB:', dbError);
    }

    // Build system prompt (falls back gracefully to DEFAULT_KB if kb is null)
    const systemPrompt = buildSystemPrompt(kb);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured in .env.local' }, { status: 500 });
    }

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

    // Format chat history for Gemini API
    const contents = messages
      .filter((m: any) => m.content && typeof m.content === 'string')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.text();
      console.error('Gemini API Error:', response.status, errData);
      return NextResponse.json({ error: `Gemini API returned ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help you learn more about Ravi Gupta and ARintelligenceX. Feel free to ask about his projects or skills!";

    // Detect lead and save conversation to MongoDB asynchronously
    (async () => {
      try {
        await connectDB();
        const newMessages = [
          ...messages,
          { role: 'assistant', content: replyText }
        ];

        const isLead =
          replyText.toLowerCase().includes('contact form') ||
          replyText.toLowerCase().includes('project') ||
          messages.some((m: any) =>
            /hire|quote|pricing|budget|freelance|build|timeline|email|phone|call/i.test(m.content || '')
          );

        await ChatSession.findOneAndUpdate(
          { sessionId },
          { 
            sessionId,
            $set: { 
              messages: newMessages,
              isLead,
            } 
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Failed to save chat session to MongoDB:', err);
      }
    })();

    // Stream the response back to useChat using Vercel AI SDK Data Stream protocol
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = replyText.split(' ');
        for (let i = 0; i < words.length; i++) {
          const piece = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(`0:${JSON.stringify(piece)}\n`));
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
