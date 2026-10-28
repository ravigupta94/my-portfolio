'use client';

import { X, Printer, Download, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e17] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Ravi Gupta — Curriculum Vitae</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ATS-Optimized
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink size={13} />
              <span>Google Drive</span>
            </a>
            <a
              href="/resume.pdf"
              download="Ravi_Gupta_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </a>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Resume Document Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-white/90 print:text-black print:bg-white text-xs sm:text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b border-white/10 print:border-black/20 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black mb-1">
              Ravi Gupta
            </h1>
            <p className="text-violet-400 print:text-purple-700 font-semibold text-sm mb-3">
              Full-Stack Developer &amp; Founder of ARintelligenceX
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 print:text-black/70">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> Noida, U.P., India
              </span>
              <a href="mailto:raviguptasrn2004@gmail.com" className="flex items-center gap-1 hover:underline">
                <Mail size={12} /> raviguptasrn2004@gmail.com
              </a>
              <a href="tel:+919455125449" className="flex items-center gap-1 hover:underline">
                <Phone size={12} /> +91 9455125449
              </a>
              <a href="https://linkedin.com/in/ravigupta94" target="_blank" className="flex items-center gap-1 hover:underline">
                <FaLinkedin size={12} /> linkedin.com/in/ravigupta94
              </a>
              <a href="https://github.com/ravigupta94" target="_blank" className="flex items-center gap-1 hover:underline">
                <FaGithub size={12} /> github.com/ravigupta94
              </a>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2">
              Professional Summary
            </h2>
            <p className="text-white/70 print:text-black/80 text-xs sm:text-sm">
              Hands-on Full-Stack Developer with 3+ years of experience engineering high-performance web applications,
              APIs, and AI-enabled software solutions. Founder of ARintelligenceX, managing a team of 7 and delivering
              production software for healthcare, e-commerce, and enterprise clients across India and the UK. Passionate
              about maintainable architecture, low latency, and honest timelines.
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2">
              Core Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <strong className="text-white print:text-black">Frontend:</strong> React.js, Next.js 14 (App Router), TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5/CSS3
              </div>
              <div>
                <strong className="text-white print:text-black">Backend:</strong> Node.js, Express.js, RESTful API Design, JWT Authentication, Microservices
              </div>
              <div>
                <strong className="text-white print:text-black">Database:</strong> MongoDB Atlas (Aggregation, Replica Sets), Mongoose ODM, MySQL
              </div>
              <div>
                <strong className="text-white print:text-black">AI &amp; Cloud:</strong> Google Gemini API, OpenAI SDK, Vercel, Git/GitHub CI/CD, Three.js
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700">
              Work Experience
            </h2>

            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  Founder &amp; Lead Full Stack Developer — ARintelligenceX
                </h3>
                <span className="text-xs text-white/50 print:text-black/60">2023 — Present</span>
              </div>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Founded and scaled a digital product engineering agency with a cross-functional team of 7.</li>
                <li>Architected full-stack enterprise portals, custom CMS dashboards, and AI integrations for international clients.</li>
                <li>Standardized developer workflows, code reviews, and automated deployment pipelines on Vercel.</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  Full Stack Developer — Independent Client Projects
                </h3>
                <span className="text-xs text-white/50 print:text-black/60">2022 — 2023</span>
              </div>
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Delivered end-to-end full-stack systems across healthcare, hospitality, and retail verticals.</li>
                <li>Engineered database schemas with Mongoose and secured multi-role authentication workflows.</li>
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700">
              Key Production Projects
            </h2>

            <div>
              <div className="font-semibold text-white print:text-black text-xs">
                Hospital Management System (React, Node.js, Express, MongoDB)
              </div>
              <p className="text-xs text-white/60 print:text-black/70">
                Centralized platform eliminating paper clinical workflows — automated patient records, doctor scheduling, OPD queues, and multi-tier invoicing.
              </p>
            </div>

            <div>
              <div className="font-semibold text-white print:text-black text-xs">
                Restaurant Management System (React, Node.js, Express, MongoDB)
              </div>
              <p className="text-xs text-white/60 print:text-black/70">
                Real-time tablet table order processing, kitchen display relay, inventory thresholds, and end-of-day revenue analytics.
              </p>
            </div>

            <div>
              <div className="font-semibold text-white print:text-black text-xs">
                Apna Bazar (Next.js, Node.js, MongoDB, Tailwind CSS)
              </div>
              <p className="text-xs text-white/60 print:text-black/70">
                Dynamic e-commerce marketplace empowering non-technical vendors with code-free inventory, category, and order management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
