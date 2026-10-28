const fs = require('fs');
const mongoose = require('mongoose');

let uri = process.env.MONGODB_URI;
if (!uri && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=([^\r\n]+)/);
  if (match) uri = match[1].trim();
}
if (!uri) {
  uri = 'mongodb://raviguptasr200_db_user:E1bE8vYc0PVGlvxG@ac-eoxjuyu-shard-00-00.icjkwzz.mongodb.net:27017,ac-eoxjuyu-shard-00-01.icjkwzz.mongodb.net:27017,ac-eoxjuyu-shard-00-02.icjkwzz.mongodb.net:27017/portfolio?ssl=true&replicaSet=atlas-7om8ko-shard-0&authSource=admin&retryWrites=true&w=majority';
}

async function runSeed() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const Project = mongoose.model('Project', new mongoose.Schema({
    title: String, slug: String, description: String, longDescription: String,
    techStack: [String], liveUrl: String, githubUrl: String, featured: Boolean,
    order: Number, category: String,
  }, { timestamps: true }));

  const Skill = mongoose.model('Skill', new mongoose.Schema({
    name: String, category: String, level: Number, icon: String, order: Number,
  }, { timestamps: true }));

  const Experience = mongoose.model('Experience', new mongoose.Schema({
    title: String, organization: String, startDate: String, endDate: String,
    current: Boolean, description: String, order: Number,
  }, { timestamps: true }));

  const Company = mongoose.model('Company', new mongoose.Schema({
    name: String, tagline: String, description: String, mission: String,
    vision: String, services: [{ title: String, description: String, icon: String }],
    teamSize: Number, founderName: String, founderRole: String, website: String,
    location: String, email: String, founded: String,
  }, { timestamps: true }));

  const KnowledgeBase = mongoose.model('KnowledgeBase', new mongoose.Schema({
    identity: {
      fullName: String, role: String, location: String,
      contact: { email: String, phone: String },
      social: { linkedin: String, github: String, instagram: String },
      resume: String,
    },
    about: String,
    skills: { frontend: String, backend: String, database: String, other: String },
    company: {
      name: String, tagline: String, story: String, location: String,
      teamSize: Number, raviRole: String, services: String, website: String,
    },
    projects: String,
    services: String,
    conversationRules: [String],
    faqs: [{ question: String, answer: String }],
    assistantTone: String,
  }, { timestamps: true }));

  // 1. Projects
  const projects = [
    {
      title: 'Hospital Management System',
      slug: 'hospital-management-system',
      description: 'A comprehensive digital platform designed to modernise hospital operations — managing patient records, appointments, doctor schedules, billing, and admin workflows in one centralised system.',
      longDescription: 'The Hospital Management System eliminates the inefficiencies of manual, paper-based hospital workflows. Built for multi-department use, it centralises patient data — from registration and appointment booking to diagnostic records and discharge summaries.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      featured: true,
      order: 1,
      category: 'Healthcare',
    },
    {
      title: 'Restaurant Management System',
      slug: 'restaurant-management-system',
      description: 'An end-to-end system for managing restaurant operations — table bookings, order processing, billing, inventory tracking, and staff management — all in one place.',
      longDescription: 'Designed for both dine-in and takeaway operations, this system streamlines every stage of the restaurant workflow. Front-of-house staff can place orders directly from a tablet, which are instantly relayed to the kitchen display.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      featured: true,
      order: 2,
      category: 'Hospitality',
    },
    {
      title: 'Apna Bazar',
      slug: 'apna-bazar',
      description: 'A dynamic e-commerce and marketplace platform where vendors and admins can manage product listings, categories, and inventory entirely through an admin panel — no code changes required.',
      longDescription: 'Apna Bazar is built around one principle: business owners should never need a developer to update their shop. The admin panel lets vendors add products, set pricing, manage categories, and track orders independently.',
      techStack: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      featured: true,
      order: 3,
      category: 'E-Commerce',
    },
  ];

  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  console.log('Seeded projects: 3');

  // 2. Skills
  const skills = [
    { name: 'React', category: 'Frontend', level: 90, icon: 'SiReact', order: 1 },
    { name: 'Next.js', category: 'Frontend', level: 88, icon: 'SiNextdotjs', order: 2 },
    { name: 'TypeScript', category: 'Frontend', level: 82, icon: 'SiTypescript', order: 3 },
    { name: 'JavaScript', category: 'Frontend', level: 92, icon: 'SiJavascript', order: 4 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'SiTailwindcss', order: 5 },
    { name: 'HTML5 / CSS3', category: 'Frontend', level: 95, icon: 'SiHtml5', order: 6 },
    { name: 'Node.js', category: 'Backend', level: 85, icon: 'SiNodedotjs', order: 1 },
    { name: 'Express.js', category: 'Backend', level: 85, icon: 'SiExpress', order: 2 },
    { name: 'REST APIs', category: 'Backend', level: 88, icon: 'SiPostman', order: 3 },
    { name: 'MongoDB', category: 'Database', level: 85, icon: 'SiMongodb', order: 1 },
    { name: 'MySQL', category: 'Database', level: 72, icon: 'SiMysql', order: 2 },
    { name: 'Git / GitHub', category: 'Other', level: 88, icon: 'SiGithub', order: 1 },
    { name: 'AI / API Integration', category: 'Other', level: 80, icon: 'SiOpenai', order: 2 },
    { name: 'UI / UX Design', category: 'Other', level: 75, icon: 'SiFigma', order: 3 },
    { name: 'Vercel / Render', category: 'Other', level: 82, icon: 'SiVercel', order: 4 },
  ];

  for (const s of skills) {
    await Skill.findOneAndUpdate({ name: s.name }, s, { upsert: true, new: true });
  }
  console.log('Seeded skills: 15');

  // 3. Experience
  const experiences = [
    {
      title: 'Founder & Lead Developer',
      organization: 'ARintelligenceX',
      startDate: '2023',
      current: true,
      description: 'Founded and lead a software development company focused on delivering honest, reliable digital solutions. Oversee project architecture, client communication, and end-to-end delivery.',
      order: 1,
    },
    {
      title: 'Full Stack Developer',
      organization: 'Freelance / Independent Projects',
      startDate: '2022',
      endDate: '2023',
      current: false,
      description: 'Designed and built full-stack web applications for clients across healthcare, hospitality, and e-commerce verticals.',
      order: 2,
    },
    {
      title: 'Frontend Developer (Learning & Building)',
      organization: 'Self-Directed Projects',
      startDate: '2021',
      endDate: '2022',
      current: false,
      description: 'Built a strong foundation in modern web development through hands-on project work.',
      order: 3,
    },
  ];

  for (const e of experiences) {
    await Experience.findOneAndUpdate({ title: e.title, organization: e.organization }, e, { upsert: true, new: true });
  }
  console.log('Seeded experiences: 3');

  // 4. Company
  const companyData = {
    name: 'ARintelligenceX',
    tagline: 'We build the software your business actually runs on.',
    description: 'ARintelligenceX started as a small team tired of watching clients get burned by agencies who overpromise and under-deliver. Built around one idea: do good work, support what is shipped, and be honest about what can and cannot be done. Based in Noida, India; we work with clients across India and the UK.',
    mission: 'To deliver reliable, honest, and high-quality software solutions that genuinely solve business problems.',
    vision: 'To become a trusted long-term technology partner for growing businesses.',
    services: [
      { title: 'Web Development', description: 'Full-stack web apps built to perform, scale, and last.', icon: 'Globe' },
      { title: 'App Development', description: 'Mobile and cross-platform apps that users actually enjoy.', icon: 'Smartphone' },
      { title: 'AI Services', description: 'Practical AI integrations — chatbots, automation, and smart features.', icon: 'Brain' },
      { title: 'UI/UX Design', description: 'Interfaces that are beautiful, intuitive, and conversion-focused.', icon: 'Palette' },
      { title: 'Email Migration', description: 'Seamless migration to Google Workspace, Microsoft 365, and more.', icon: 'Mail' },
      { title: 'CRM / ERP Solutions', description: 'Custom or configured business management systems.', icon: 'BarChart2' },
      { title: 'Digital Marketing', description: 'SEO, content, and campaigns that drive real growth.', icon: 'TrendingUp' },
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

  await Company.findOneAndUpdate({ name: 'ARintelligenceX' }, companyData, { upsert: true, new: true });
  console.log('Seeded company: ARintelligenceX');

  // 5. KnowledgeBase
  const kbData = {
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
      resume: 'https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link',
    },
    about: 'Ravi is a full stack developer with a practical, no-nonsense approach to building software. Alongside his development work, he founded ARintelligenceX, a small team focused on doing honest, quality work for clients.',
    skills: {
      frontend: 'React, Next.js, JavaScript/TypeScript, Tailwind CSS, HTML5, CSS3',
      backend: 'Node.js, Express.js, REST API design',
      database: 'MongoDB, MySQL',
      other: 'Git/GitHub, AI/API integration, basic UI/UX, deployment (Vercel, Render)',
    },
    company: {
      name: 'ARintelligenceX',
      tagline: 'We build the software your business actually runs on.',
      story: 'Started as a small team tired of watching clients get burned by agencies who overpromise and underdeliver.',
      location: 'Noida, India. Clients across India and the UK.',
      teamSize: 7,
      raviRole: 'Founder',
      services: 'Web Development, App Development, AI Services, UI/UX Design, Email Migration, CRM/ERP Solutions, Digital Marketing',
      website: 'https://arintelligenx.vercel.app/',
    },
    projects: '1. Hospital Management System — Digitizes patient records, appointment scheduling, doctor rosters, billing, and admin operations.\n2. Restaurant Management System — Manages orders, table bookings, billing, inventory, and staff operations.\n3. Apna Bazar — Dynamic e-commerce/marketplace platform where products, categories, and inventory are fully manageable from an admin panel.',
    services: 'Custom web application development, Mobile/web app development, AI integration & AI-powered features, UI/UX design, Email migration & setup, CRM/ERP systems, Digital marketing',
    conversationRules: [
      'If asked "Who is Ravi?" -> give the About summary, offer to share skills/projects/company info',
      'If asked for Ravi\'s resume, CV, or credentials -> directly provide the official Google Drive link: https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link and mention the on-site resume modal',
      'If asked about projects -> summarize the 3 projects, ask if they want details on a specific one',
      'If asked "Is Ravi available for freelance/hire?" -> say yes, direct them to fill the contact form or email directly, and ask briefly what kind of project they have in mind',
      'If asked about pricing/cost estimate -> explain that cost depends on scope, suggest sending project details via contact form',
      'Never fabricate testimonials, client names, revenue figures, or years of experience not explicitly provided'
    ],
    faqs: [
      {
        question: 'Who is Ravi Gupta?',
        answer: 'Ravi is a full stack developer and founder of ARintelligenceX, a tech company based in Noida. He builds real, working software — web apps, AI features, admin systems.'
      },
      {
        question: "Can I see Ravi's resume or CV?",
        answer: "Yes! Ravi's official resume is available on Google Drive here: https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link . You can also view or print the ATS-friendly version directly from this website."
      },
      {
        question: 'What has Ravi built?',
        answer: 'Ravi has built the Hospital Management System, Restaurant Management System, and Apna Bazar e-commerce marketplace.'
      },
      {
        question: 'Can I hire Ravi?',
        answer: 'Yes! Ravi is open to freelance and company projects through ARintelligenceX. Feel free to reach out via the contact form.'
      }
    ],
    assistantTone: 'Friendly, confident, professional — like a smart colleague introducing Ravi.'
  };

  await KnowledgeBase.findOneAndUpdate({}, kbData, { upsert: true, new: true });
  console.log('Seeded KnowledgeBase successfully!');

  console.log('\n>>> ALL 5 DATASETS SEEDED TO MONGODB ATLAS SUCCESSFULLY! <<<');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seed Error:', err);
  process.exit(1);
});
