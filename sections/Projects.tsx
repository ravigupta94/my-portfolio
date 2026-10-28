'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  category?: string;
}

const FALLBACK: Project[] = [
  {
    _id: '1',
    title: 'Hospital Management System',
    description:
      'A comprehensive digital platform to manage patient records, appointments, doctor schedules, billing, and admin operations — replacing manual hospital workflows with accurate, centralised, real-time data management.',
    longDescription:
      'The Hospital Management System eliminates the inefficiencies of manual, paper-based hospital workflows. Built for multi-department use, it centralises patient data — from registration and appointment booking to diagnostic records and discharge summaries. The billing module automates invoice generation and payment tracking, while the scheduling engine prevents double-bookings for doctors and operating theatres. Admins get a real-time dashboard with bed availability, OPD queue, and staff roster — everything needed to run a modern hospital digitally.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Healthcare',
  },
  {
    _id: '2',
    title: 'Restaurant Management System',
    description:
      'End-to-end system for table bookings, order processing, billing, inventory, and staff management. Reduces manual errors, speeds up service, and gives owners real-time visibility into operations.',
    longDescription:
      'Designed for both dine-in and takeaway operations, this system streamlines every stage of the restaurant workflow. Front-of-house staff can place orders directly from a tablet, which are instantly relayed to the kitchen display. The table management module shows live seat availability and booking status. Inventory tracking alerts when stock falls below threshold, preventing stockouts during busy periods. The billing module supports multiple payment methods and auto-generates end-of-day reports for the owner.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Hospitality',
  },
  {
    _id: '3',
    title: 'Apna Bazar',
    description:
      'A dynamic e-commerce and marketplace platform where vendors manage products, categories, and inventory via an admin panel — no code required. Built for non-technical business owners who need full control.',
    longDescription:
      'Apna Bazar is built around one principle: business owners should never need a developer to update their shop. The admin panel lets vendors add products, set pricing, manage categories, and track orders independently. The storefront is automatically updated in real time. Features include product search and filtering, cart and checkout flow, order tracking, and a review system. The platform is architected to support multiple vendors with separate dashboards, making it suitable for marketplace use cases where multiple sellers operate under one roof.',
    techStack: ['Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'E-Commerce',
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Healthcare: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Hospitality: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  'E-Commerce': { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.length > 0) setProjects(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.querySelectorAll('.reveal').forEach((el, i) => {
            (el as HTMLElement).style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
          });
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [projects]);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label reveal mb-3">Work</p>
          <h2
            id="projects-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            Production systems built for businesses — click any card for architecture &amp; case study.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 reveal">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => {
            const catStyle = project.category
              ? CATEGORY_COLORS[project.category] || { bg: 'rgba(124,58,237,0.12)', text: '#a78bfa' }
              : { bg: 'rgba(124,58,237,0.12)', text: '#a78bfa' };

            return (
              <article
                key={project._id}
                onClick={() => setSelectedCaseStudy(project)}
                className="glass-card p-6 flex flex-col reveal group cursor-pointer hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 0.1}s` }}
                aria-label={project.title}
              >
                {/* Category badge & Case study hint */}
                <div className="flex items-center justify-between mb-4">
                  {project.category && (
                    <div
                      className="inline-flex px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.text}33` }}
                    >
                      {project.category}
                    </div>
                  )}
                  <span className="text-[11px] text-violet-400 font-medium group-hover:underline flex items-center gap-1">
                    Case Study →
                  </span>
                </div>

                {/* Project visual — gradient placeholder */}
                <div
                  className="w-full h-40 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${catStyle.bg}, rgba(0,0,0,0.4))`,
                    border: `1px solid ${catStyle.text}22`,
                  }}
                >
                  <div
                    className="text-5xl font-black opacity-15 select-none tracking-tighter"
                    style={{ color: catStyle.text }}
                  >
                    {project.title.slice(0, 2).toUpperCase()}
                  </div>
                  {/* Decorative orb */}
                  <div
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-30"
                    style={{ background: catStyle.text }}
                  />
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-purple)] transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-5 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div
                  className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--border-dark)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent-purple)] hover:underline"
                      aria-label={`View ${project.title} live`}
                    >
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Enterprise Deployment</span>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      aria-label={`${project.title} GitHub`}
                    >
                      <FaGithub size={13} /> Code
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12 reveal">
          <a
            href="https://github.com/ravigupta94"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <span>View All on GitHub</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedCaseStudy(null)}
        >
          <div
            className="bg-[#0f0f18] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Category */}
            {selectedCaseStudy.category && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 inline-block mb-3">
                {selectedCaseStudy.category} Architecture
              </span>
            )}

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {selectedCaseStudy.title}
            </h3>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCaseStudy.techStack.map((t) => (
                <span key={t} className="tech-badge">
                  {t}
                </span>
              ))}
            </div>

            {/* Deep dive details */}
            <div className="space-y-6 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-white/10 pt-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-violet-400" /> System Overview &amp; Purpose
                </h4>
                <p>{selectedCaseStudy.longDescription || selectedCaseStudy.description}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Architectural Highlights
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/80">
                  <li>Full-stack architecture optimized for responsiveness, low latency, and high concurrency.</li>
                  <li>Modular database schema designed in MongoDB with indexes for rapid query resolution.</li>
                  <li>Clean separation of concerns between client components and secure REST API services.</li>
                  <li>Built with zero code friction for non-technical stakeholders and business administrators.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-white/10">
                {selectedCaseStudy.liveUrl && (
                  <a
                    href={selectedCaseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2.5 px-4"
                  >
                    <span>Visit Live System</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                {selectedCaseStudy.githubUrl && (
                  <a
                    href={selectedCaseStudy.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs py-2.5 px-4"
                  >
                    <FaGithub size={14} />
                    <span>View Repository</span>
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={() => setSelectedCaseStudy(null)}
                  className="text-xs text-violet-400 hover:underline ml-auto"
                >
                  Want something similar built? Let&apos;s talk →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
