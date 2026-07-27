import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Company from '@/models/Company';

/**
 * GET /api/seed
 * One-time endpoint to populate all MongoDB collections with initial data.
 * Safe to call multiple times — uses upsert logic.
 * After the admin panel (Part 3) is set up, this can be disabled.
 */
export async function GET() {
  try {
    await connectDB();

    // ─── PROJECTS ──────────────────────────────────────────────────────────
    const projects = [
      {
        title: 'Hospital Management System',
        slug: 'hospital-management-system',
        description:
          'A comprehensive digital platform designed to modernise hospital operations — managing patient records, appointments, doctor schedules, billing, and admin workflows in one centralised system. Replaces paper-based processes with accurate, real-time data management, improving staff efficiency and patient care quality.',
        longDescription:
          'The Hospital Management System eliminates the inefficiencies of manual, paper-based hospital workflows. Built for multi-department use, it centralises patient data — from registration and appointment booking to diagnostic records and discharge summaries. The billing module automates invoice generation and payment tracking, while the scheduling engine prevents double-bookings for doctors and operating theatres. Admins get a real-time dashboard with bed availability, OPD queue, and staff roster — everything needed to run a modern hospital digitally.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        featured: true,
        order: 1,
        category: 'Healthcare',
      },
      {
        title: 'Restaurant Management System',
        slug: 'restaurant-management-system',
        description:
          'An end-to-end system for managing restaurant operations — table bookings, order processing, billing, inventory tracking, and staff management — all in one place. Reduces manual errors, speeds up service, and gives owners real-time visibility into their business.',
        longDescription:
          'Designed for both dine-in and takeaway operations, this system streamlines every stage of the restaurant workflow. Front-of-house staff can place orders directly from a tablet, which are instantly relayed to the kitchen display. The table management module shows live seat availability and booking status. Inventory tracking alerts when stock falls below threshold, preventing stockouts during busy periods. The billing module supports multiple payment methods and auto-generates end-of-day reports for the owner.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        featured: true,
        order: 2,
        category: 'Hospitality',
      },
      {
        title: 'Apna Bazar',
        slug: 'apna-bazar',
        description:
          'A dynamic e-commerce and marketplace platform where vendors and admins can manage product listings, categories, and inventory entirely through an admin panel — no code changes required. Built for scale and ease of use for non-technical business owners.',
        longDescription:
          'Apna Bazar is built around one principle: business owners should never need a developer to update their shop. The admin panel lets vendors add products, set pricing, manage categories, and track orders independently. The storefront is automatically updated in real time. Features include product search and filtering, cart and checkout flow, order tracking, and a review system. The platform is architected to support multiple vendors with separate dashboards, making it suitable for marketplace use cases where multiple sellers operate under one roof.',
        techStack: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        featured: true,
        order: 3,
        category: 'E-Commerce',
      },
    ];

    for (const p of projects) {
      await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    }

    // ─── SKILLS ────────────────────────────────────────────────────────────
    const skills = [
      // Frontend
      { name: 'React', category: 'Frontend', level: 90, icon: 'SiReact', order: 1 },
      { name: 'Next.js', category: 'Frontend', level: 88, icon: 'SiNextdotjs', order: 2 },
      { name: 'TypeScript', category: 'Frontend', level: 82, icon: 'SiTypescript', order: 3 },
      { name: 'JavaScript', category: 'Frontend', level: 92, icon: 'SiJavascript', order: 4 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'SiTailwindcss', order: 5 },
      { name: 'HTML5 / CSS3', category: 'Frontend', level: 95, icon: 'SiHtml5', order: 6 },
      // Backend
      { name: 'Node.js', category: 'Backend', level: 85, icon: 'SiNodedotjs', order: 1 },
      { name: 'Express.js', category: 'Backend', level: 85, icon: 'SiExpress', order: 2 },
      { name: 'REST APIs', category: 'Backend', level: 88, icon: 'SiPostman', order: 3 },
      // Database
      { name: 'MongoDB', category: 'Database', level: 85, icon: 'SiMongodb', order: 1 },
      { name: 'MySQL', category: 'Database', level: 72, icon: 'SiMysql', order: 2 },
      // Other
      { name: 'Git / GitHub', category: 'Other', level: 88, icon: 'SiGithub', order: 1 },
      { name: 'AI / API Integration', category: 'Other', level: 80, icon: 'SiOpenai', order: 2 },
      { name: 'UI / UX Design', category: 'Other', level: 75, icon: 'SiFigma', order: 3 },
      { name: 'Vercel / Render', category: 'Other', level: 82, icon: 'SiVercel', order: 4 },
    ];

    for (const s of skills) {
      await Skill.findOneAndUpdate({ name: s.name }, s, { upsert: true, new: true });
    }

    // ─── EXPERIENCE ────────────────────────────────────────────────────────
    const experiences = [
      {
        title: 'Founder & Lead Developer',
        organization: 'ARintelligenceX',
        startDate: '2023',
        current: true,
        description:
          'Founded and lead a software development company focused on delivering honest, reliable digital solutions. Oversee project architecture, client communication, and end-to-end delivery across web, app, and AI integration projects. Manage a team of 7 across development, design, and marketing.',
        order: 1,
      },
      {
        title: 'Full Stack Developer',
        organization: 'Freelance / Independent Projects',
        startDate: '2022',
        endDate: '2023',
        current: false,
        description:
          'Designed and built full-stack web applications for clients across healthcare, hospitality, and e-commerce verticals. Specialised in React + Node.js stacks, MongoDB data modelling, and responsive UI development. Delivered multiple production-ready systems used by real businesses.',
        order: 2,
      },
      {
        title: 'Frontend Developer (Learning & Building)',
        organization: 'Self-Directed Projects',
        startDate: '2021',
        endDate: '2022',
        current: false,
        description:
          'Built a strong foundation in modern web development through hands-on project work. Developed proficiency in React, JavaScript, CSS, and UI fundamentals by shipping progressively more complex projects — from landing pages to interactive dashboards.',
        order: 3,
      },
    ];

    for (const e of experiences) {
      await Experience.findOneAndUpdate(
        { title: e.title, organization: e.organization },
        e,
        { upsert: true, new: true }
      );
    }

    // ─── COMPANY ───────────────────────────────────────────────────────────
    const companyData = {
      name: 'ARintelligenceX',
      tagline: 'We build the software your business actually runs on.',
      description:
        'ARintelligenceX started as a small team tired of watching clients get burned by agencies who overpromise and under-deliver. Built around one idea: do good work, support what\'s shipped, and be honest about what can and cannot be done. Based in Noida, India; we work with clients across India and the UK.',
      mission:
        'To deliver reliable, honest, and high-quality software solutions that genuinely solve business problems — without unnecessary complexity, inflated timelines, or empty promises.',
      vision:
        'To become a trusted long-term technology partner for growing businesses — known not just for what we build, but for how we show up: with transparency, ownership, and a genuine commitment to client success.',
      services: [
        { title: 'Web Development', description: 'Full-stack web apps built to perform, scale, and last.', icon: 'Globe' },
        { title: 'App Development', description: 'Mobile and cross-platform apps that users actually enjoy.', icon: 'Smartphone' },
        { title: 'AI Services', description: 'Practical AI integrations — chatbots, automation, and smart features.', icon: 'Brain' },
        { title: 'UI/UX Design', description: 'Interfaces that are beautiful, intuitive, and conversion-focused.', icon: 'Palette' },
        { title: 'Email Migration', description: 'Seamless migration to Google Workspace, Microsoft 365, and more.', icon: 'Mail' },
        { title: 'CRM / ERP Solutions', description: 'Custom or configured business management systems.', icon: 'BarChart2' },
        { title: 'Digital Marketing', description: 'SEO, content, and campaigns that drive real, measurable growth.', icon: 'TrendingUp' },
        { title: 'Tech Consulting', description: 'Honest advice on architecture, tools, and what to build next.', icon: 'Lightbulb' },
      ],
      teamSize: 7,
      founderName: 'Ravi Gupta',
      founderRole: 'Founder',
      website: 'https://arintelligenx.vercel.app/',
      location: 'Noida, U.P., India',
      email: 'raviguptasrn2004@gmail.com',
      founded: '2023',
    };

    await Company.findOneAndUpdate(
      { name: 'ARintelligenceX' },
      companyData,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: '✅ Database seeded successfully! Projects, Skills, Experience, and Company data are ready.',
      counts: {
        projects: projects.length,
        skills: skills.length,
        experience: experiences.length,
        company: 1,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Seed failed. Make sure MONGODB_URI is set in .env.local',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
