'use client';

import { useEffect, useRef } from 'react';
import { Code2, Users, Lightbulb, CheckCircle } from 'lucide-react';

const traits = [
  { icon: Code2, label: 'Practical Builder', desc: 'Ships real products, not demos' },
  { icon: CheckCircle, label: 'Honest Communicator', desc: 'Says what can and cannot be done' },
  { icon: Users, label: 'Team Leader', desc: 'Leads ARintelligenceX\'s 7-person team' },
  { icon: Lightbulb, label: 'Problem Solver', desc: 'Focuses on what the business actually needs' },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = section.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            reveals.forEach((el, i) => {
              (el as HTMLElement).style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'none';
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <p className="section-label reveal mb-4">About</p>
            <h2
              id="about-heading"
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 reveal"
            >
              Building software that{' '}
              <span className="gradient-text">actually matters</span>
            </h2>

            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed reveal">
              <p>
                I&apos;m Ravi Gupta — a full stack developer based in Noida, India, and the founder
                of a software company built on a simple premise: do the work properly, support what
                you ship, and never promise what you can&apos;t deliver.
              </p>
              <p>
                I build end-to-end web applications — from the database schema to the pixel-perfect
                front end — with a focus on systems that are reliable, maintainable, and genuinely
                useful to the people who use them. My work spans healthcare platforms, e-commerce
                systems, restaurant management tools, and more.
              </p>
              <p>
                What drives me isn&apos;t the tech stack or the latest framework — it&apos;s the
                moment a client says &quot;this actually fixed our problem.&quot; That&apos;s what I
                build towards. Practical, honest, and built to last.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 reveal">
              {['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript'].map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
              <a
                href="https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs py-1.5 px-3 ml-1 inline-flex items-center gap-1.5 hover:border-violet-500"
              >
                <span>📄 View Resume (Google Drive)</span>
              </a>
            </div>
          </div>

          {/* Right — trait cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {traits.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="glass-card p-6 reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.12)] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[var(--accent-purple)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{label}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
