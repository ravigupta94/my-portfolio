'use client';

import { X, Printer, Download, MapPin, Mail, Phone, ExternalLink, Award, GraduationCap, Briefcase, Code, Server } from 'lucide-react';
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

  const resumeDriveUrl = 'https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e17] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-white/5 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Ravi Gupta — Curriculum Vitae</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
              Verified ATS
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={resumeDriveUrl}
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
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Resume Document */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-white/90 print:text-black print:bg-white text-xs sm:text-sm leading-relaxed">
          {/* Header */}
          <div className="border-b border-white/10 print:border-black/20 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black mb-1">
              Ravi Gupta
            </h1>
            <p className="text-violet-400 print:text-purple-700 font-semibold text-sm mb-3">
              Technical Support Engineer &amp; Full Stack Web Developer | Founder of ARintelligenceX
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60 print:text-black/70">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-violet-400 print:text-black" /> Varanasi / Noida, India
              </span>
              <a href="mailto:raviguptasrn2004@gmail.com" className="flex items-center gap-1 hover:underline">
                <Mail size={12} className="text-violet-400 print:text-black" /> raviguptasrn2004@gmail.com
              </a>
              <a href="tel:+919455125449" className="flex items-center gap-1 hover:underline">
                <Phone size={12} className="text-violet-400 print:text-black" /> +91 9455125449
              </a>
              <a href="https://linkedin.com/in/ravigupta94" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <FaLinkedin size={12} className="text-violet-400 print:text-black" /> linkedin.com/in/ravigupta94
              </a>
              <a href="https://github.com/ravigupta94" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <FaGithub size={12} className="text-violet-400 print:text-black" /> github.com/ravigupta94
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2 flex items-center gap-1.5">
              <Server size={14} /> Professional Summary
            </h2>
            <p className="text-white/70 print:text-black/80 text-xs sm:text-sm leading-relaxed">
              Technical Support Engineer with hands-on experience in Windows Server monitoring, incident management,
              troubleshooting, and server storage management. Experienced in remotely monitoring Windows Server environments,
              analyzing incidents and alerts through monitoring tools, troubleshooting software and application-related issues,
              and escalating complex incidents to appropriate technical teams. Solid background in PHP Laravel development,
              RESTful APIs, MySQL database management, and modern Full Stack Web development (React, Next.js, Node.js).
              Founder of ARintelligenceX, leading digital solutions for international businesses.
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2.5 flex items-center gap-1.5">
              <Code size={14} /> Technical Skills &amp; Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <span className="font-semibold text-white print:text-black block mb-1">
                  Technical Support &amp; Server Ops:
                </span>
                <span className="text-white/70 print:text-black/80">
                  Windows Server Monitoring, Remote Desktop, Incident Analysis, Intelliv Platform, Root Cause Analysis, Storage Management, SSMS SQL Queries
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <span className="font-semibold text-white print:text-black block mb-1">
                  Full Stack Web Development:
                </span>
                <span className="text-white/70 print:text-black/80">
                  PHP, Laravel, React.js, Next.js 14, TypeScript, JavaScript (ES6+), Node.js, Express.js, HTML5, CSS3, Tailwind CSS
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <span className="font-semibold text-white print:text-black block mb-1">
                  Databases &amp; Systems:
                </span>
                <span className="text-white/70 print:text-black/80">
                  SQL Server (SSMS), MySQL (Query Optimization, RBAC), MongoDB Atlas (Mongoose ODM)
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <span className="font-semibold text-white print:text-black block mb-1">
                  Tools, Version Control &amp; Cloud:
                </span>
                <span className="text-white/70 print:text-black/80">
                  Git, GitHub, VS Code, Vercel, Netlify, RESTful APIs, AWS (Currently Learning)
                </span>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 flex items-center gap-1.5">
              <Briefcase size={14} /> Work Experience
            </h2>

            {/* Role 1 */}
            <div className="border-l-2 border-violet-500/40 pl-3.5 space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  Technical Support Engineer — AnG India Ltd.
                </h3>
                <span className="text-xs text-violet-300 print:text-purple-700 font-medium">NOIDA | May 2026 — Present</span>
              </div>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Remotely connect to Windows Servers using assigned server IDs for server monitoring, diagnostics, and troubleshooting.</li>
                <li>Monitored server health, alerts, and critical incidents using the Intelliv monitoring platform.</li>
                <li>Investigated Windows Server incidents and performed root-cause analysis to ensure high uptime.</li>
                <li>Monitored server storage utilization and resolved disk space and storage alerts.</li>
                <li>Used SQL Server Management Studio (SSMS) to write queries, retrieve data, and investigate database-related issues.</li>
                <li>Troubleshot software/application incidents and escalated unresolved cases with detailed logs to engineering teams.</li>
              </ul>
            </div>

            {/* Role 2 */}
            <div className="border-l-2 border-violet-500/40 pl-3.5 space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  PHP Laravel Developer — Namisite Technologies Pvt. Ltd.
                </h3>
                <span className="text-xs text-violet-300 print:text-purple-700 font-medium">Greater Noida | Oct 2025 — Mar 2026</span>
              </div>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Developed and maintained dynamic web applications using PHP and the Laravel framework.</li>
                <li>Designed and implemented RESTful APIs for frontend applications and third-party integrations.</li>
                <li>Worked with MySQL for schema design, complex query handling, and performance optimization.</li>
                <li>Implemented secure user authentication, authorization, and Role-Based Access Control (RBAC).</li>
                <li>Diagnosed application bugs, improved response latency, and collaborated via Git/GitHub.</li>
              </ul>
            </div>

            {/* Role 3 */}
            <div className="border-l-2 border-violet-500/40 pl-3.5 space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  PHP Full Stack Developer Apprentice — DigiCoders
                </h3>
                <span className="text-xs text-violet-300 print:text-purple-700 font-medium">Lucknow | Jul 2025 — Jan 2026</span>
              </div>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Completed rigorous hands-on training in PHP Full Stack Development (HTML, CSS, JS, PHP, MySQL, Laravel).</li>
                <li>Engineered real-world web applications and gained deep experience deploying projects to live hosting platforms.</li>
                <li>Sharpened problem-solving, debugging, and architecture skills through team projects.</li>
              </ul>
            </div>

            {/* Role 4 */}
            <div className="border-l-2 border-violet-500/40 pl-3.5 space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                <h3 className="font-bold text-white print:text-black text-sm">
                  Founder &amp; Lead Full Stack Developer — ARintelligenceX
                </h3>
                <span className="text-xs text-violet-300 print:text-purple-700 font-medium">Noida | 2024 — Present</span>
              </div>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-white/70 print:text-black/80">
                <li>Founded an IT services team of 7 providing Web/App Development, AI Solutions, ERP/CRM, and UI/UX.</li>
                <li>Built and deployed production platforms for clients across India and the UK with modern Next.js/MERN stacks.</li>
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700">
              Key Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <div className="font-semibold text-white print:text-black flex justify-between">
                  <span>ARintelligenceX Platform</span>
                  <a href="https://arintelligenx.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-violet-400 print:text-purple-700 hover:underline inline-flex items-center gap-1">
                    Live <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-white/60 print:text-black/70 mt-1">
                  Modern responsive business platform covering Web/App Development, AI Integration, ERP/CRM, and client portals with automated Vercel deployment.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <div className="font-semibold text-white print:text-black flex justify-between">
                  <span>Singh Delight Restaurant Website</span>
                  <a href="https://singh-delight.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-violet-400 print:text-purple-700 hover:underline inline-flex items-center gap-1">
                    Live <ExternalLink size={10} />
                  </a>
                </div>
                <p className="text-white/60 print:text-black/70 mt-1">
                  Fully responsive restaurant website showcasing menu items, customer reservations, and interactive dining services (HTML, CSS, JavaScript).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <div className="font-semibold text-white print:text-black">
                  Hospital Management System
                </div>
                <p className="text-white/60 print:text-black/70 mt-1">
                  Centralized healthcare application digitizing patient medical records, OPD queue scheduling, doctor rostering, and billing (React, Node.js, Express, MongoDB).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white/5 print:bg-gray-100 border border-white/5 print:border-black/10">
                <div className="font-semibold text-white print:text-black">
                  Apna Bazar Marketplace
                </div>
                <p className="text-white/60 print:text-black/70 mt-1">
                  Dynamic e-commerce marketplace enabling non-technical store owners to manage categories, inventory, and orders without code (Next.js, Node.js, MongoDB).
                </p>
              </div>
            </div>
          </div>

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10 print:border-black/20">
            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2 flex items-center gap-1.5">
                <GraduationCap size={14} /> Education
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-white print:text-black">Degree - Computer Application (BCA)</div>
                  <div className="text-white/60 print:text-black/70">Kashi Institute of Technology, Varanasi | Jul 2023 — Aug 2025</div>
                </div>
                <div>
                  <div className="font-semibold text-white print:text-black">Intermediate — Science</div>
                  <div className="text-white/60 print:text-black/70">Ananti Inter College, Mirzapur | Jul 2020 — Jul 2022</div>
                </div>
                <div>
                  <div className="font-semibold text-white print:text-black">High School — Science</div>
                  <div className="text-white/60 print:text-black/70">Ananti Inter College, Mirzapur | Feb 2018 — Feb 2020</div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-violet-400 print:text-purple-700 mb-2 flex items-center gap-1.5">
                <Award size={14} /> Certifications
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-white print:text-black">PHP Full Stack Developer</div>
                  <div className="text-white/60 print:text-black/70">DigiCoders Technologies Pvt. Ltd. | Jul 2025 — Jan 2026</div>
                </div>
                <div>
                  <div className="font-semibold text-white print:text-black">ADCA (Advanced Diploma in Computer Applications)</div>
                  <div className="text-white/60 print:text-black/70">Jay Institute of Technology | Jul 2024</div>
                </div>
                <div>
                  <div className="font-semibold text-white print:text-black">Diploma in Python</div>
                  <div className="text-white/60 print:text-black/70">Dev Institute of Technology | Jul 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
