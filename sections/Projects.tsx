'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';


interface Project {
  _id: string;
  title: string;
  description: string;
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
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Healthcare',
  },
  {
    _id: '2',
    title: 'Restaurant Management System',
    description:
      'End-to-end system for table bookings, order processing, billing, inventory, and staff management. Reduces manual errors, speeds up service, and gives owners real-time visibility into operations.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    category: 'Hospitality',
  },
  {
    _id: '3',
    title: 'Apna Bazar',
    description:
      'A dynamic e-commerce and marketplace platform where vendors manage products, categories, and inventory via an admin panel — no code required. Built for non-technical business owners who need full control.',
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
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setProjects(d.data); })
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

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Work</p>
          <h2
            id="projects-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            Real systems built for real businesses — not portfolio demos.
          </p>
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const catStyle = project.category
              ? CATEGORY_COLORS[project.category] || { bg: 'rgba(124,58,237,0.12)', text: '#a78bfa' }
              : { bg: 'rgba(124,58,237,0.12)', text: '#a78bfa' };

            return (
              <article
                key={project._id}
                className="glass-card p-6 flex flex-col reveal group"
                style={{ transitionDelay: `${i * 0.1}s` }}
                aria-label={project.title}
              >
                {/* Category badge */}
                {project.category && (
                  <div
                    className="inline-flex self-start px-3 py-1 rounded-full text-xs font-medium mb-4"
                    style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.text}33` }}
                  >
                    {project.category}
                  </div>
                )}

                {/* Project visual — gradient placeholder */}
                <div
                  className="w-full h-40 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${catStyle.bg}, rgba(0,0,0,0.3))`,
                    border: `1px solid ${catStyle.text}22`,
                  }}
                >
                  <div
                    className="text-5xl font-black opacity-10 select-none"
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

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-5">
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
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--border-dark)]">
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
                    <span className="text-xs text-[var(--text-muted)]">Private Project</span>
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
    </section>
  );
}
