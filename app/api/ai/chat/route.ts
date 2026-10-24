import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { connectDB } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';
import ChatSession from '@/models/ChatSession';
import { buildSystemPrompt } from '@/lib/systemPrompt';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
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

    // Call OpenAI
    const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const result = await streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages,
      onFinish: async ({ text }) => {
        try {
          await connectDB();
          // Save the conversation to DB
          const newMessages = [
            ...messages,
            { role: 'assistant', content: text }
          ];

          const isLead =
            text.toLowerCase().includes('contact form') ||
            text.toLowerCase().includes('project') ||
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
        } catch (error) {
          console.error('Failed to save chat session:', error);
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
