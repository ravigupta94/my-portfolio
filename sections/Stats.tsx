'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: Stat[] = [
  { value: 3, suffix: '+', label: 'Years Building', color: '#7c3aed' },
  { value: 20, suffix: '+', label: 'Projects Shipped', color: '#3b82f6' },
  { value: 7, suffix: '', label: 'Team Members', color: '#06b6d4' },
  { value: 15, suffix: '+', label: 'Clients Served', color: '#10b981' },
];

function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [start, target, duration]);

  return count;
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.value, 1600, active);
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div
        className="text-5xl sm:text-6xl font-extrabold mb-2 tabular-nums"
        style={{ color: stat.color }}
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      >
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 border-y border-[var(--border-dark)] relative overflow-hidden"
      aria-label="Statistics"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--border-dark)] border border-[var(--border-dark)] rounded-2xl overflow-hidden glass-card">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
