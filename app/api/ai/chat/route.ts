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

    await connectDB();
    
    // Fetch knowledge base
    const kb = await KnowledgeBase.findOne();
    if (!kb) {
      return NextResponse.json({ error: 'Knowledge Base not configured' }, { status: 500 });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(kb);

    // Call OpenAI
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      onFinish: async ({ text, finishReason }) => {
        try {
          // Save the conversation to DB
          const newMessages = [
            ...messages,
            { role: 'assistant', content: text }
          ];
          
          await ChatSession.findOneAndUpdate(
            { sessionId },
            { 
              sessionId,
              $set: { 
                messages: newMessages,
                isLead: text.toLowerCase().includes('contact form') || text.toLowerCase().includes('project') ? true : false 
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
