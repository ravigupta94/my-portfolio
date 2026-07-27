'use client';

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';

interface Experience {
  _id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

const FALLBACK: Experience[] = [
  {
    _id: '1',
    title: 'Founder & Lead Developer',
    organization: 'ARintelligenceX',
    startDate: '2023',
    current: true,
    description:
      'Founded and lead a software development company focused on delivering honest, reliable digital solutions. Oversee architecture, client communication, and end-to-end delivery. Manage a team of 7.',
  },
  {
    _id: '2',
    title: 'Full Stack Developer',
    organization: 'Freelance / Independent Projects',
    startDate: '2022',
    endDate: '2023',
    current: false,
    description:
      'Designed and built full-stack web applications for clients across healthcare, hospitality, and e-commerce. Specialised in React + Node.js, MongoDB data modelling, and responsive UI development.',
  },
  {
    _id: '3',
    title: 'Frontend Developer (Learning & Building)',
    organization: 'Self-Directed Projects',
    startDate: '2021',
    endDate: '2022',
    current: false,
    description:
      'Built a strong foundation in modern web development through hands-on project work — React, JavaScript, CSS, and UI fundamentals — by shipping progressively more complex projects.',
  },
];

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>(FALLBACK);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setExperiences(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.querySelectorAll('.reveal').forEach((el, i) => {
            (el as HTMLElement).style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [experiences]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Journey</p>
          <h2
            id="experience-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            Experience &amp; <span className="gradient-text">Timeline</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative pl-12">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-purple)] via-[var(--accent-blue)] to-transparent" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <div key={exp._id} className="relative reveal">
                {/* Dot */}
                <div className="absolute -left-7 top-1 flex items-center justify-center">
                  <div className="timeline-dot" />
                </div>

                <div className="glass-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)] text-lg">{exp.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase size={13} className="text-[var(--accent-purple)]" />
                        <span className="text-sm text-[var(--accent-purple)] font-medium">
                          {exp.organization}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Calendar size={12} />
                      <span>
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                      {exp.current && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.15)] text-[var(--accent-purple)] text-xs font-medium border border-[rgba(124,58,237,0.25)]">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
