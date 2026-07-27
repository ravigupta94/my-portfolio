'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Mail, Phone, MapPin, Send, CheckCircle, AlertCircle
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';


type FormState = 'idle' | 'loading' | 'success' | 'error';

const SOCIALS = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:raviguptasrn2004@gmail.com',
    value: 'raviguptasrn2004@gmail.com',
    color: '#ea4335',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:+919455125449',
    value: '+91 9455125449',
    color: '#10b981',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ravigupta94/',
    value: 'linkedin.com/in/ravigupta94',
    color: '#0077b5',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/ravigupta94',
    value: 'github.com/ravigupta94',
    color: '#f1f5f9',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/_ravi_gupta9000/',
    value: '@_ravi_gupta9000',
    color: '#e1306c',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
            (el as HTMLElement).style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setFormState('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormState('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[var(--border-dark)] bg-[rgba(255,255,255,0.03)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[rgba(124,58,237,0.3)] transition-all duration-200';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3">Contact</p>
          <h2
            id="contact-heading"
            className="text-4xl sm:text-5xl font-bold tracking-tight reveal"
          >
            Let&apos;s <span className="gradient-text">work together</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            Have a project in mind, a problem to solve, or just want to talk tech? Reach out — I
            respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — contact info */}
          <div className="reveal-left">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={16} className="text-[var(--accent-purple)]" />
              <span className="text-sm text-[var(--text-secondary)]">Noida, U.P., India</span>
            </div>

            <div className="space-y-4">
              {SOCIALS.map(({ icon: Icon, label, href, value, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') || href.startsWith('tel') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 glass-card group"
                  aria-label={`${label}: ${value}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="text-sm text-[var(--text-primary)] mt-0.5 group-hover:text-[var(--accent-purple)] transition-colors">
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="glass-card p-8 reveal-right">
            <h3 className="font-bold text-xl text-[var(--text-primary)] mb-6">Send a message</h3>

            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                  <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <h4 className="font-semibold text-[var(--text-primary)] text-lg">Message Sent!</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Thanks! Ravi will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="btn-outline text-sm mt-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder="Tell me about your project or idea…"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {formState === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-sm text-red-400">
                    <AlertCircle size={15} />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  id="contact-submit"
                  aria-label="Send message"
                >
                  <span>{formState === 'loading' ? 'Sending…' : 'Send Message'}</span>
                  {formState !== 'loading' && <Send size={15} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
