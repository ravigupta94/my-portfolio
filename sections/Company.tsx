'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Globe, Smartphone, Brain, Palette, Mail,
  BarChart2, TrendingUp, Lightbulb, ExternalLink, Users, MapPin
} from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon?: string;
}

interface CompanyData {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  services: Service[];
  teamSize: number;
  founderName: string;
  website: string;
  location: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Smartphone, Brain, Palette, Mail,
  BarChart2, TrendingUp, Lightbulb,
};

const FALLBACK_COMPANY: CompanyData = {
  name: 'ARintelligenceX',
  tagline: 'We build the software your business actually runs on.',
  description:
    "ARintelligenceX started as a small team tired of watching clients get burned by agencies who overpromise and under-deliver. Built around one idea: do good work, support what's shipped, and be honest about what can and cannot be done. Based in Noida, India; we work with clients across India and the UK.",
  mission:
    'To deliver reliable, honest, and high-quality software solutions that genuinely solve business problems — without unnecessary complexity, inflated timelines, or empty promises.',
  vision:
    'To become a trusted long-term technology partner for growing businesses — known not just for what we build, but for how we show up: with transparency, ownership, and a genuine commitment to client success.',
  services: [
    { title: 'Web Development', description: 'Full-stack web apps built to perform, scale, and last.', icon: 'Globe' },
    { title: 'App Development', description: 'Mobile and cross-platform apps that users actually enjoy.', icon: 'Smartphone' },
    { title: 'AI Services', description: 'Practical AI integrations — chatbots, automation, smart features.', icon: 'Brain' },
    { title: 'UI/UX Design', description: 'Interfaces that are beautiful, intuitive, and conversion-focused.', icon: 'Palette' },
    { title: 'Email Migration', description: 'Seamless migration to Google Workspace, Microsoft 365, and more.', icon: 'Mail' },
    { title: 'CRM / ERP Solutions', description: 'Custom or configured business management systems.', icon: 'BarChart2' },
    { title: 'Digital Marketing', description: 'SEO, content, and campaigns that drive real, measurable growth.', icon: 'TrendingUp' },
    { title: 'Tech Consulting', description: 'Honest advice on architecture, tools, and what to build next.', icon: 'Lightbulb' },
  ],
  teamSize: 7,
  founderName: 'Ravi Gupta',
  website: 'https://arintelligenx.vercel.app/',
  location: 'Noida, U.P., India',
};

export default function Company() {
  const [company, setCompany] = useState<CompanyData>(FALLBACK_COMPANY);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data) setCompany(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.querySelectorAll('.reveal').forEach((el, i) => {
            (el as HTMLElement).style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
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
  }, [company]);

  return (
    <section
      id="company"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="company-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Company</p>
          <h2
            id="company-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            <span className="gradient-text">{company.name}</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto reveal font-light italic">
            &quot;{company.tagline}&quot;
          </p>
        </div>

        {/* Description + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 glass-card p-8 reveal">
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{company.description}</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-purple)] mb-2">
                  Mission
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{company.mission}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-blue)] mb-2">
                  Vision
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{company.vision}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 reveal flex flex-col gap-6 justify-center">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[var(--accent-purple)]" />
              <div>
                <div className="text-2xl font-bold gradient-text">{company.teamSize}</div>
                <div className="text-xs text-[var(--text-muted)]">Team Members</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[var(--accent-blue)]" />
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)]">{company.location}</div>
                <div className="text-xs text-[var(--text-muted)]">Serving India &amp; UK</div>
              </div>
            </div>
            <div className="pt-2">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
                aria-label="Visit ARintelligenceX website"
              >
                <span>Visit Company Website</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Services grid */}
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8 reveal text-center">
            What we <span className="gradient-text">build</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {company.services.map((service, i) => {
              const Icon = service.icon ? (ICON_MAP[service.icon] ?? Globe) : Globe;
              return (
                <div
                  key={service.title}
                  className="glass-card p-5 reveal"
                  style={{ transitionDelay: `${i * 0.06}s` }}
                >
                  <div className="w-9 h-9 rounded-lg bg-[rgba(124,58,237,0.12)] flex items-center justify-center mb-3">
                    <Icon size={17} className="text-[var(--accent-purple)]" />
                  </div>
                  <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{service.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
