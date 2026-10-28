'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import ResumeModal from '@/components/ResumeModal';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Estimate', href: '#estimate' },
  { label: 'Company', href: '#company' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  // Scrolled glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on link click
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        className={cn('navbar', scrolled && 'scrolled')}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl tracking-tight"
            aria-label="Ravi Gupta — Home"
          >
            <span className="gradient-text">RG</span>
            <span className="text-[var(--text-secondary)] ml-1 text-sm font-medium hidden sm:inline">
              / Ravi Gupta
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-7" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-xs lg:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--accent-purple)] transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Resume button */}
            <button
              onClick={() => setResumeOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/80 hover:text-white hover:border-violet-500/50 text-xs font-medium transition-all"
            >
              <FileText size={13} className="text-violet-400" />
              <span>Resume</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 rounded-lg border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-purple)] transition-all duration-200"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Hire Me CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex btn-primary text-xs py-2 px-3.5"
            >
              <span>Hire Me</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="md:hidden w-8 h-8 rounded-lg border border-[var(--border-dark)] flex items-center justify-center text-white/80"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-card mx-4 mt-2 p-6 rounded-2xl border border-white/10 shadow-2xl">
            <ul className="flex flex-col gap-4" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={handleNavClick}
                    className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setResumeOpen(true);
                  }}
                  className="btn-outline w-full justify-center text-xs py-2.5"
                >
                  <FileText size={14} className="text-violet-400" />
                  <span>View Curriculum Vitae (PDF)</span>
                </button>
                <a
                  href="#contact"
                  onClick={handleNavClick}
                  className="btn-primary w-full justify-center text-xs py-2.5"
                >
                  <span>Hire Me</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
