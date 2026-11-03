import { NextResponse } from 'next/server';
import dns from 'dns';
import { connectDB } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';
import ChatSession from '@/models/ChatSession';
import { buildSystemPrompt, DEFAULT_KB } from '@/lib/systemPrompt';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Allow responses up to 30 seconds on Vercel
export const maxDuration = 30;

// Fallback encoded credentials if environment variable is not set in Vercel settings
const getFallbackKey = () =>
  Buffer.from('QVEuQWI4Uk42THJfd3RKbE5sLUw4aklWakE0YWFpQnVfakRJbmVsSGZpSjRPNG1sRmM0anc=', 'base64').toString('ascii');

// Fallback intelligent answer generator if Gemini API is unreachable or times out
function generateSmartFallback(lastUserMessage: string): string {
  const query = (lastUserMessage || '').toLowerCase();

  if (/resume|cv|biodata|curriculum/i.test(query)) {
    return "You can view and download Ravi's official resume on Google Drive here: https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view .\n\nYou can also click the 'Resume' button in the navbar to inspect or print the ATS-optimized version directly!";
  }

  if (/cost|price|pricing|estimate|quote|rate|how much/i.test(query)) {
    return "Project costs depend on your specific scope, features, and timeline. You can try the live **Project Cost Estimator** on this page (scroll to #estimate) to get an instant calculation in INR or USD, or send your requirements via the contact form for a tailored quote!";
  }

  if (/project|hospital|restaurant|apna bazar|built|portfolio/i.test(query)) {
    return "Ravi has engineered several full-scale production applications:\n\n1. **Hospital Management System** — Digitizes patient records, appointments, doctor rosters, and billing.\n2. **Restaurant Management System** — Real-time table reservations, order management, and inventory tracking.\n3. **Apna Bazar** — Modern e-commerce marketplace with full vendor CMS management.\n\nCheck out the Projects section on this page to view live case studies!";
  }

  if (/hire|freelance|available|work with|contact|email|phone/i.test(query)) {
    return "Yes! Ravi is open to freelance projects and contracts through ARintelligenceX. You can leave your project details in the contact form below or reach him directly at **raviguptasrn2004@gmail.com** or **+91 9455125449**.";
  }

  if (/arintelligencex|company|agency|team/i.test(query)) {
    return "ARintelligenceX is Ravi's software company based in Noida, India. With a skilled team of 7, they engineer web applications, mobile apps, AI solutions, UI/UX designs, and ERP/CRM systems for businesses across India and the UK. Website: https://arintelligenx.vercel.app/";
  }

  if (/skill|tech|stack|language|framework/i.test(query)) {
    return "Ravi's core tech stack includes **React, Next.js, TypeScript, Tailwind CSS** on the frontend, and **Node.js, Express, MongoDB, REST APIs** on the backend, alongside AI integration and deployment on Vercel/Render.";
  }

  return "Ravi Gupta is a Full Stack Developer & Founder of ARintelligenceX based in Noida, India. He builds real, reliable software solutions for clients across India and the UK. Would you like to know about his projects, skills, pricing estimates, or view his resume?";
}

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Valid messages array is required' }, { status: 400 });
    }

    // Attempt to load custom KnowledgeBase with 2-second timeout so DB latency never blocks the chat
    let kb = null;
    try {
      await Promise.race([
        connectDB(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('DB timeout')), 2000)),
      ]);
      kb = await KnowledgeBase.findOne().maxTimeMS(2000).lean();
    } catch {
      // Gracefully fall back to DEFAULT_KB
    }

    const systemPrompt = buildSystemPrompt(kb);

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      getFallbackKey();

    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-flash-lite',
    ];

    const contents = messages
      .filter((m: any) => m.content && typeof m.content === 'string')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const lastUserMsg =
      [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';

    let replyText = '';

    // Try calling Gemini models sequentially
    for (const model of candidateModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated && generated.trim().length > 0) {
            replyText = generated.trim();
            break;
          }
        } else {
          console.warn(`Model ${model} returned status ${response.status}`);
        }
      } catch (err: any) {
        console.warn(`Error calling model ${model}:`, err.message);
      }
    }

    // If all models failed or network timed out, use resilient fallback knowledge generator
    if (!replyText) {
      replyText = generateSmartFallback(lastUserMsg);
    }

    // Asynchronously log session without blocking user response
    if (sessionId) {
      connectDB()
        .then(() => {
          const isLead =
            replyText.toLowerCase().includes('contact form') ||
            replyText.toLowerCase().includes('project') ||
            messages.some((m: any) =>
              /hire|quote|pricing|budget|freelance|build|timeline|email|phone|call/i.test(m.content || '')
            );

          return ChatSession.findOneAndUpdate(
            { sessionId },
            {
              sessionId,
              $set: {
                messages: [...messages, { role: 'assistant', content: replyText }],
                isLead,
              },
            },
            { upsert: true, new: true }
          );
        })
        .catch((err) => {
          console.warn('Async session log warning:', err.message);
        });
    }

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
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    // Even on severe catch, return a streaming response instead of 500 error so Vercel never breaks!
    const fallbackText =
      "I'm here to help you learn more about Ravi Gupta and ARintelligenceX. Feel free to ask about his software projects, skills, or view his resume!";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(fallbackText)}\n`));
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  }
}
