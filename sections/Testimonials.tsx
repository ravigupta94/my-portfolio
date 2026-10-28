'use client';

import { useEffect, useRef } from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  rating: number;
  projectTag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Dr. Arvind Verma',
    role: 'Medical Director',
    company: 'Verma Healthcare Clinic',
    location: 'Noida, India',
    content:
      'The Hospital Management System Ravi built replaced our entire paper-based records. OPD queue management and patient billing became effortless. He delivered on time and provides genuine support whenever we need it.',
    rating: 5,
    projectTag: 'Healthcare System',
  },
  {
    name: 'Karan Mehra',
    role: 'Managing Partner',
    company: 'SpiceRoute Hospitality Group',
    location: 'Delhi-NCR',
    content:
      'Ravi built our restaurant order management system from the ground up. Table turnaround times dropped, and order errors were eliminated. He doesn\'t sell hype — he writes solid, practical code that runs businesses.',
    rating: 5,
    projectTag: 'Restaurant Suite',
  },
  {
    name: 'Oliver Davies',
    role: 'Technical Product Lead',
    company: 'Omniflow Digital',
    location: 'London, UK',
    content:
      'We engaged Ravi and the ARintelligenceX team for Next.js web application modules and AI API workflows. Excellent code quality, prompt communication across time zones, and total honesty about architectural tradeoffs.',
    rating: 5,
    projectTag: 'AI & Web Architecture',
  },
  {
    name: 'Pooja Aggarwal',
    role: 'Founder',
    company: 'EthnicCrafts Marketplace',
    location: 'Uttar Pradesh, India',
    content:
      'With Apna Bazar, we got an e-commerce platform where non-technical vendors can manage inventory and catalogs without touching code. Ravi is a developer who genuinely listens to what the business needs.',
    rating: 5,
    projectTag: 'E-Commerce Marketplace',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-padding relative"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Feedback</p>
          <h2
            id="testimonials-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            Honest feedback from founders, doctors, and business leaders who run software built by Ravi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="glass-card p-7 flex flex-col justify-between reveal relative group hover:border-violet-500/30 transition-all duration-300"
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <div>
                {/* Rating & Project Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                    {t.projectTag}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-dark)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{t.name}</h4>
                    <CheckCircle size={13} className="text-emerald-400" />
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {t.role} · <span className="text-[var(--text-secondary)]">{t.company}</span> ({t.location})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
