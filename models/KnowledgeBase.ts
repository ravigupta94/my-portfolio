import mongoose, { Schema, Document } from 'mongoose';

export interface FAQ {
  question: string;
  answer: string;
}

export interface IKnowledgeBase extends Document {
  identity: {
    fullName: string;
    role: string;
    location: string;
    contact: {
      email: string;
      phone: string;
    };
    social: {
      linkedin: string;
      github: string;
      instagram: string;
    };
    resume?: string;
  };
  about: string;
  skills: {
    frontend: string;
    backend: string;
    database: string;
    other: string;
  };
  company: {
    name: string;
    tagline: string;
    story: string;
    location: string;
    teamSize: number;
    raviRole: string;
    services: string;
    website: string;
  };
  projects: string; // Summarized list of projects for the AI
  services: string; // List of services
  conversationRules: string[];
  faqs: FAQ[];
  assistantTone: string;
  updatedAt: Date;
}

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    identity: {
      fullName: { type: String, default: 'Ravi Gupta' },
      role: { type: String, default: 'Full Stack Developer & Founder of ARintelligenceX' },
      location: { type: String, default: 'Noida, Uttar Pradesh, India' },
      contact: {
        email: { type: String, default: 'raviguptasrn2004@gmail.com' },
        phone: { type: String, default: '+91 9455125449' },
      },
      social: {
        linkedin: { type: String, default: 'https://www.linkedin.com/in/ravigupta94/' },
        github: { type: String, default: 'https://github.com/ravigupta94' },
        instagram: { type: String, default: 'https://www.instagram.com/_ravi_gupta9000/' },
        resume: { type: String, default: 'https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link' },
      },
    },
    about: { type: String, required: true },
    skills: {
      frontend: { type: String, default: 'React, Next.js, JavaScript/TypeScript, Tailwind CSS, HTML5, CSS3' },
      backend: { type: String, default: 'Node.js, Express.js, REST API design' },
      database: { type: String, default: 'MongoDB, MySQL' },
      other: { type: String, default: 'Git/GitHub, AI/API integration, basic UI/UX, deployment (Vercel, Render)' },
    },
    company: {
      name: { type: String, default: 'ARintelligenceX' },
      tagline: { type: String, default: 'We build the software your business actually runs on.' },
      story: { type: String, required: true },
      location: { type: String, default: 'Noida, India. Clients across India and the UK.' },
      teamSize: { type: Number, default: 7 },
      raviRole: { type: String, default: 'Founder' },
      services: { type: String, required: true },
      website: { type: String, default: 'https://arintelligenx.vercel.app/' },
    },
    projects: { type: String, required: true },
    services: { type: String, required: true },
    conversationRules: [{ type: String }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    assistantTone: { type: String, default: 'Friendly, confident, professional' },
  },
  { timestamps: true }
);

export default mongoose.models.KnowledgeBase || mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema);
