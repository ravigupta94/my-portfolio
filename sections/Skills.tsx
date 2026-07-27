'use client';

import { useEffect, useRef, useState } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

const CATEGORY_ORDER = ['Frontend', 'Backend', 'Database', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: '#7c3aed',
  Backend: '#3b82f6',
  Database: '#06b6d4',
  Other: '#10b981',
};

// Fallback skills if DB is not connected
const FALLBACK_SKILLS: Skill[] = [
  { _id: '1', name: 'React', category: 'Frontend', level: 90 },
  { _id: '2', name: 'Next.js', category: 'Frontend', level: 88 },
  { _id: '3', name: 'TypeScript', category: 'Frontend', level: 82 },
  { _id: '4', name: 'JavaScript', category: 'Frontend', level: 92 },
  { _id: '5', name: 'Tailwind CSS', category: 'Frontend', level: 90 },
  { _id: '6', name: 'HTML5 / CSS3', category: 'Frontend', level: 95 },
  { _id: '7', name: 'Node.js', category: 'Backend', level: 85 },
  { _id: '8', name: 'Express.js', category: 'Backend', level: 85 },
  { _id: '9', name: 'REST APIs', category: 'Backend', level: 88 },
  { _id: '10', name: 'MongoDB', category: 'Database', level: 85 },
  { _id: '11', name: 'MySQL', category: 'Database', level: 72 },
  { _id: '12', name: 'Git / GitHub', category: 'Other', level: 88 },
  { _id: '13', name: 'AI / API Integration', category: 'Other', level: 80 },
  { _id: '14', name: 'UI / UX Design', category: 'Other', level: 75 },
  { _id: '15', name: 'Vercel / Render', category: 'Other', level: 82 },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK_SKILLS);
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const animated = useRef(false);

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setSkills(d.data); })
      .catch(() => {});
  }, []);

  // Animate bars on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;

          // Reveal items
          const reveals = section.querySelectorAll('.reveal');
          reveals.forEach((el, i) => {
            (el as HTMLElement).style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
          });

          // Animate skill bars
          const bars = section.querySelectorAll<HTMLDivElement>('.skill-bar-fill');
          bars.forEach((bar) => {
            const target = bar.dataset.level || '0';
            bar.style.width = `${target}%`;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [skills]);

  const grouped = CATEGORY_ORDER.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Skills</p>
          <h2
            id="skills-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            What I <span className="gradient-text">work with</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            A practical toolkit built from real project work — not tutorial completions.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORY_ORDER.map((category) => (
            <div key={category} className="glass-card p-8 reveal">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: CATEGORY_COLORS[category] }}
                />
                <h3 className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-sm">
                  {category}
                </h3>
              </div>

              <div className="space-y-5">
                {grouped[category]?.map((skill) => (
                  <div key={skill._id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {skill.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        data-level={skill.level}
                        style={{
                          background: `linear-gradient(90deg, ${CATEGORY_COLORS[category]}, var(--accent-cyan))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
