'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, MapPin, ExternalLink } from 'lucide-react';

const TAGLINES = [
  'Shipping software that works — no hype, just code.',
  'From idea to production. Clean, honest, delivered.',
  'Real products, honest timelines, reliable code.',
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const taglineIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ─── Three.js Particle Background ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import('three');

    (async () => {
      THREE = await import('three');
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
      camera.position.z = 5;

      // Particle geometry — instanced for performance
      const count = 350;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0x7c3aed,
        size: 0.028,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Secondary faint blue particles
      const positions2 = new Float32Array(150 * 3);
      for (let i = 0; i < 150; i++) {
        positions2[i * 3] = (Math.random() - 0.5) * 20;
        positions2[i * 3 + 1] = (Math.random() - 0.5) * 12;
        positions2[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      const geo2 = new THREE.BufferGeometry();
      geo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
      const mat2 = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.018, transparent: true, opacity: 0.3 });
      scene.add(new THREE.Points(geo2, mat2));

      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.0008;
        particles.rotation.y = t * 0.15;
        particles.rotation.x = t * 0.07;
        renderer.render(scene, camera);
      };

      animate();

      const onResize = () => {
        if (!canvas) return;
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    })();

    return () => cancelAnimationFrame(animId);
  }, []);

  // ─── Mouse Spotlight ─────────────────────────────────────────────────────
  useEffect(() => {
    const hero = heroRef.current;
    const spotlight = spotlightRef.current;
    if (!hero || !spotlight) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      spotlight.style.setProperty('--mouse-x', `${x}%`);
      spotlight.style.setProperty('--mouse-y', `${y}%`);
    };

    hero.addEventListener('mousemove', onMouseMove);
    return () => hero.removeEventListener('mousemove', onMouseMove);
  }, []);

  // ─── Typing Animation ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = typingRef.current;
    if (!el) return;

    const type = () => {
      const current = TAGLINES[taglineIdx.current];
      if (!deleting.current) {
        el.textContent = current.slice(0, charIdx.current + 1);
        charIdx.current++;
        if (charIdx.current === current.length) {
          deleting.current = true;
          typingTimer.current = setTimeout(type, 2200);
          return;
        }
      } else {
        el.textContent = current.slice(0, charIdx.current - 1);
        charIdx.current--;
        if (charIdx.current === 0) {
          deleting.current = false;
          taglineIdx.current = (taglineIdx.current + 1) % TAGLINES.length;
        }
      }
      typingTimer.current = setTimeout(type, deleting.current ? 40 : 65);
    };

    typingTimer.current = setTimeout(type, 800);
    return () => clearTimeout(typingTimer.current);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        id="hero-canvas"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Mouse spotlight */}
      <div ref={spotlightRef} className="mouse-spotlight" aria-hidden="true" />

      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Location badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-glass)] bg-[var(--glass-bg)] backdrop-blur-sm text-xs text-[var(--text-secondary)] mb-8"
          style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}
        >
          <MapPin size={12} className="text-[var(--accent-purple)]" />
          Noida, U.P., India
        </div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 leading-none"
          style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}
        >
          <span className="gradient-text">Ravi</span>{' '}
          <span className="text-[var(--text-primary)]">Gupta</span>
        </h1>

        {/* Title */}
        <p
          className="text-lg sm:text-xl text-[var(--text-secondary)] font-medium mb-6"
          style={{ animation: 'fadeUp 0.6s ease 0.45s both' }}
        >
          Full Stack Developer{' '}
          <span className="text-[var(--accent-purple)]">&amp;</span> Founder,{' '}
          <a
            href="https://arintelligenx.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-purple)] transition-colors inline-flex items-center gap-1"
          >
            ARintelligenceX
            <ExternalLink size={14} />
          </a>
        </p>

        {/* Typing tagline */}
        <div
          className="h-10 flex items-center justify-center mb-10"
          style={{ animation: 'fadeUp 0.6s ease 0.6s both' }}
          aria-live="polite"
        >
          <p className="text-xl sm:text-2xl font-light text-[var(--text-secondary)]">
            <span ref={typingRef} className="text-[var(--text-primary)]" />
            <span className="inline-block w-0.5 h-6 bg-[var(--accent-purple)] ml-1 animate-[cursorBlink_1s_step-end_infinite]" />
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 flex-wrap"
          style={{ animation: 'fadeUp 0.6s ease 0.75s both' }}
        >
          <a href="#projects" className="btn-primary">
            <span>View Projects</span>
          </a>
          <a
            href="https://drive.google.com/file/d/1imjweXbWI-MzPY7KQHxSeNCtxtUmUHos/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline border-[var(--accent-purple)] text-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/10 inline-flex items-center gap-2"
          >
            <span>📄 View Resume (Drive)</span>
            <ExternalLink size={14} />
          </a>
          <a href="#estimate" className="btn-outline">
            <span>⚡ Calculate Cost</span>
          </a>
          <a href="#contact" className="btn-outline">
            <span>Hire Me</span>
          </a>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16 flex-wrap"
          style={{ animation: 'fadeUp 0.6s ease 0.9s both' }}
        >
          {[
            { value: '3+', label: 'Years Building' },
            { value: '20+', label: 'Projects Shipped' },
            { value: '7', label: 'Team Members' },
            { value: '15+', label: 'Clients Served' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] animate-bounce"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
