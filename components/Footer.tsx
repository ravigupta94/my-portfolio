'use client';

import Link from 'next/link';
import { ArrowUp, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';


const socials = [
  { icon: FaGithub, href: 'https://github.com/ravigupta94', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ravigupta94/', label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://www.instagram.com/_ravi_gupta9000/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:raviguptasrn2004@gmail.com', label: 'Email' },
];

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Company', href: '#company' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-[var(--border-dark)] bg-[var(--bg-dark)] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold gradient-text mb-3">Ravi Gupta</div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Full Stack Developer & Founder of ARintelligenceX. Building software that businesses
              actually run on.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-purple)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-widest">
              Get In Touch
            </h3>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p>Noida, U.P., India</p>
              <a
                href="mailto:raviguptasrn2004@gmail.com"
                className="block hover:text-[var(--accent-purple)] transition-colors"
              >
                raviguptasrn2004@gmail.com
              </a>
              <a
                href="tel:+919455125449"
                className="block hover:text-[var(--accent-purple)] transition-colors"
              >
                +91 9455125449
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-dark)]">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Ravi Gupta. Built with Next.js & ❤️
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-9 h-9 rounded-lg border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-purple)] hover:border-[var(--accent-purple)] transition-all duration-200"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
