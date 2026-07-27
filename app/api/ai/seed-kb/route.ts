import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';

export async function GET() {
  try {
    await connectDB();

    const kbCount = await KnowledgeBase.countDocuments();
    if (kbCount > 0) {
      return NextResponse.json({ message: 'Knowledge Base already seeded.' }, { status: 400 });
    }

    const initialKB = new KnowledgeBase({
      identity: {
        fullName: 'Ravi Gupta',
        role: 'Full Stack Developer & Founder of ARintelligenceX',
        location: 'Noida, Uttar Pradesh, India',
        contact: {
          email: 'raviguptasrn2004@gmail.com',
          phone: '+91 9455125449',
        },
        social: {
          linkedin: 'https://www.linkedin.com/in/ravigupta94/',
          github: 'https://github.com/ravigupta94',
          instagram: 'https://www.instagram.com/_ravi_gupta9000/',
        },
      },
      about: 'Ravi is a full stack developer with a practical, no-nonsense approach to building software — he\'d rather ship something reliable than something flashy but broken. Alongside his development work, he founded ARintelligenceX, a small team focused on doing honest, quality work for clients instead of overpromising and underdelivering.',
      skills: {
        frontend: 'React, Next.js, JavaScript/TypeScript, Tailwind CSS, HTML5, CSS3',
        backend: 'Node.js, Express.js, REST API design',
        database: 'MongoDB, MySQL',
        other: 'Git/GitHub, AI/API integration, basic UI/UX, deployment (Vercel, Render)',
      },
      company: {
        name: 'ARintelligenceX',
        tagline: 'We build the software your business actually runs on.',
        story: 'Started as a small team tired of watching clients get burned by agencies who overpromise and underdeliver. Built around one idea — do good work, support what\'s shipped, be honest about capabilities.',
        location: 'Noida, India. Clients across India and the UK.',
        teamSize: 7,
        raviRole: 'Founder',
        services: 'Web Development, App Development, AI Services, UI/UX Design, Email Migration, CRM/ERP Solutions, Digital Marketing, and more',
        website: 'https://arintelligenx.vercel.app/',
      },
      projects: '1. Hospital Management System — Digitizes patient records, appointment scheduling, doctor rosters, billing, and admin operations for hospitals/clinics, replacing manual paperwork with a centralized, accurate system.\n2. Restaurant Management System — Manages orders, table bookings, billing, inventory, and staff operations for restaurants, speeding up service and cutting manual errors.\n3. Apna Bazar — A dynamic e-commerce/marketplace platform where products, categories, and inventory are fully manageable from an admin panel without touching code.',
      services: 'Custom web application development, Mobile/web app development, AI integration & AI-powered features, UI/UX design, Email migration & setup, CRM/ERP systems, Digital marketing',
      conversationRules: [
        'If asked "Who is Ravi?" → give the About summary, offer to share skills/projects/company info',
        'If asked about projects → summarize the 3 projects, ask if they want details on a specific one',
        'If asked "Is Ravi available for freelance/hire?" → say yes, direct them to fill the contact form or email directly, and ask briefly what kind of project they have in mind (to qualify the lead)',
        'If asked about pricing/cost estimate → do NOT give a fixed number; explain that cost depends on scope, and suggest booking a quick call or sending project details via contact form',
        'If asked something outside the knowledge base (e.g., personal life details not provided, unrelated general knowledge) → politely say that\'s not something it can answer, and redirect to contact Ravi directly',
        'If a visitor seems like a potential client → naturally ask 1–2 qualifying questions (what\'s the project, what\'s the timeline) and encourage them to leave contact info',
        'Never fabricate testimonials, client names, revenue figures, or years of experience not explicitly provided'
      ],
      faqs: [
        {
          question: 'Who is Ravi Gupta?',
          answer: 'Ravi is a full stack developer and the founder of ARintelligenceX, a dev company based in Noida. He builds real, working software — web apps, AI features, admin systems — with a focus on honesty and reliability over hype. Want to know more about his projects or his company?'
        },
        {
          question: 'What has Ravi built?',
          answer: 'Ravi\'s built a few solid projects — a Hospital Management System for digitizing clinic operations, a Restaurant Management System for order/billing/inventory, and Apna Bazar, a fully dynamic e-commerce marketplace. Want details on any of these?'
        },
        {
          question: 'Can I hire Ravi?',
          answer: 'Yes, Ravi\'s open to freelance and company projects through ARintelligenceX. What kind of project are you thinking about? I can point you to the right next step — or you can drop your details in the contact form and he\'ll get back to you.'
        },
        {
          question: 'What is ARintelligenceX?',
          answer: 'It\'s Ravi\'s company — a small, 7-person team in Noida building web apps, AI services, UI/UX design, CRM/ERP systems, and more for clients across India and the UK. Their whole thing is doing honest work and actually supporting what they ship, rather than overpromising.'
        },
        {
          question: 'How much would a project cost?',
          answer: 'That really depends on the scope — a simple site and a full custom platform are very different. Best move is to share a bit about what you need through the contact form, and Ravi (or the ARintelligenceX team) can give you a proper estimate.'
        },
        {
          question: 'Does Ravi do AI projects?',
          answer: 'Yes — AI services are one of ARintelligenceX\'s core offerings, alongside web/app development, UI/UX, CRM/ERP, and digital marketing.'
        }
      ],
      assistantTone: 'Friendly, confident, professional — like a smart colleague introducing Ravi, not a robotic FAQ bot. Speaks in first person about Ravi in third person.'
    });

    await initialKB.save();

    return NextResponse.json({ message: 'Knowledge Base seeded successfully', data: initialKB }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to seed knowledge base' }, { status: 500 });
  }
}
