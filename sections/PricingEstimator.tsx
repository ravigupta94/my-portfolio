'use client';

import { useState, useRef, useEffect } from 'react';
import { Calculator, Check, ArrowRight, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface ProjectType {
  id: string;
  name: string;
  desc: string;
  baseINR: number;
  baseUSD: number;
}

const PROJECT_TYPES: ProjectType[] = [
  {
    id: 'webapp',
    name: 'Full-Stack Web App / SaaS',
    desc: 'React, Next.js, Node.js & Database',
    baseINR: 45000,
    baseUSD: 550,
  },
  {
    id: 'mobile',
    name: 'Mobile App (iOS & Android)',
    desc: 'Cross-platform app with modern UI & APIs',
    baseINR: 65000,
    baseUSD: 790,
  },
  {
    id: 'ai',
    name: 'AI Agent / Automation',
    desc: 'Custom LLM chatbot, RAG & workflow AI',
    baseINR: 35000,
    baseUSD: 420,
  },
  {
    id: 'crm',
    name: 'Custom CRM / ERP Platform',
    desc: 'Complete business management system',
    baseINR: 75000,
    baseUSD: 920,
  },
];

interface Addon {
  id: string;
  name: string;
  desc: string;
  inr: number;
  usd: number;
}

const ADDONS: Addon[] = [
  { id: 'auth', name: 'User Auth & Role Management', desc: 'Secure JWT, social login & RBAC', inr: 8000, usd: 100 },
  { id: 'payment', name: 'Payment Gateway Integration', desc: 'Stripe, Razorpay, or subscriptions', inr: 10000, usd: 120 },
  { id: 'admin', name: 'Custom Admin CMS Dashboard', desc: 'CRUD tables, filters & analytics', inr: 15000, usd: 180 },
  { id: 'ai_feat', name: 'AI Features & Chatbot', desc: 'Gemini/OpenAI intelligence integration', inr: 18000, usd: 220 },
  { id: 'realtime', name: 'Real-time Chat & WebSockets', desc: 'Instant messaging & live updates', inr: 12000, usd: 150 },
  { id: 'seo', name: 'Advanced SEO & Speed Optimization', desc: 'Lighthouse 95+, schema & meta', inr: 6000, usd: 80 },
];

const TIMELINES = [
  { id: 'flexible', label: 'Flexible (2+ months)', multiplier: 0.95 },
  { id: 'standard', label: 'Standard (4–6 weeks)', multiplier: 1.0 },
  { id: 'urgent', label: 'Express (2–3 weeks)', multiplier: 1.25 },
];

export default function PricingEstimator() {
  const [selectedType, setSelectedType] = useState<string>('webapp');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['auth', 'admin']);
  const [timeline, setTimeline] = useState<string>('standard');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Lead submission state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          section.querySelectorAll('.reveal').forEach((el, i) => {
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

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate pricing
  const currentType = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];
  const baseCost = currency === 'INR' ? currentType.baseINR : currentType.baseUSD;
  const addonsCost = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon) return sum;
    return sum + (currency === 'INR' ? addon.inr : addon.usd);
  }, 0);

  const currentTimeline = TIMELINES.find((t) => t.id === timeline) || TIMELINES[1];
  const totalCost = Math.round((baseCost + addonsCost) * currentTimeline.multiplier);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;
    setSubmitting(true);

    const summaryMessage = `[PROJECT ESTIMATE INQUIRY]
Type: ${currentType.name}
Features: ${selectedAddons.map((id) => ADDONS.find((a) => a.id === id)?.name).join(', ')}
Timeline: ${currentTimeline.label}
Estimated Budget: ${currency === 'INR' ? '₹' : '$'}${totalCost.toLocaleString()}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          message: summaryMessage,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="estimate"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      aria-labelledby="estimate-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label reveal mb-3 flex items-center justify-center gap-1.5">
            <Calculator size={14} /> Cost Calculator
          </p>
          <h2 id="estimate-heading" className="text-4xl sm:text-5xl font-bold tracking-tight reveal">
            Estimate Your <span className="gradient-text">Project Scope</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto reveal">
            Select your requirements to get an instant realistic ballpark estimate for your software.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Interactive Selectors */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Project Type */}
            <div className="glass-card p-6 reveal">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  1. Select Project Type
                </h3>
                {/* Currency Toggle */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      currency === 'INR' ? 'bg-violet-600 text-white font-medium' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    ₹ INR
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      currency === 'USD' ? 'bg-violet-600 text-white font-medium' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((t) => {
                  const isSelected = selectedType === t.id;
                  const price = currency === 'INR' ? `₹${t.baseINR.toLocaleString()}` : `$${t.baseUSD}`;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                        isSelected
                          ? 'border-violet-500 bg-violet-600/15 shadow-lg shadow-violet-600/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</span>
                        <span className="text-xs font-mono text-violet-400 font-medium">{price}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Features / Addons */}
            <div className="glass-card p-6 reveal">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                2. Key Capabilities &amp; Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((a) => {
                  const isChecked = selectedAddons.includes(a.id);
                  const price = currency === 'INR' ? `+₹${a.inr.toLocaleString()}` : `+$${a.usd}`;
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleAddon(a.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 select-none ${
                        isChecked
                          ? 'border-violet-500/80 bg-violet-600/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? 'bg-violet-600 text-white' : 'border border-white/20 bg-white/5'
                        }`}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-[var(--text-primary)] truncate">{a.name}</span>
                          <span className="text-[11px] font-mono text-violet-400 font-medium ml-2">{price}</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Delivery Speed */}
            <div className="glass-card p-6 reveal">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                3. Expected Delivery Speed
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {TIMELINES.map((tl) => {
                  const isSelected = timeline === tl.id;
                  return (
                    <button
                      type="button"
                      key={tl.id}
                      onClick={() => setTimeline(tl.id)}
                      className={`py-3 px-2 rounded-xl text-center border text-xs transition-all duration-200 ${
                        isSelected
                          ? 'border-violet-500 bg-violet-600/20 text-white font-medium'
                          : 'border-white/10 bg-white/5 text-[var(--text-secondary)] hover:border-white/20'
                      }`}
                    >
                      {tl.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Price Summary Card & Direct Inquiry Form */}
          <div className="glass-card p-6 lg:sticky lg:top-24 border border-violet-500/30 reveal">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Estimated Investment
              </span>
            </div>

            {/* Total Price Display */}
            <div className="my-4">
              <div className="text-4xl font-extrabold text-[var(--text-primary)] font-mono">
                {currency === 'INR' ? '₹' : '$'}
                {totalCost.toLocaleString()}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Ballpark estimate based on scope &amp; requirements
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 py-4 border-y border-[var(--border-dark)] text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Base Platform:</span>
                <span className="text-[var(--text-primary)] font-medium">{currentType.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Features Included:</span>
                <span className="text-[var(--text-primary)] font-medium">{selectedAddons.length} selected</span>
              </div>
              <div className="flex justify-between">
                <span>Timeline:</span>
                <span className="text-[var(--text-primary)] font-medium">{currentTimeline.label.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between pt-1 font-semibold text-white">
                <span>Support &amp; Warranty:</span>
                <span className="text-emerald-400">30 Days Included</span>
              </div>
            </div>

            {/* Submit Quote Section */}
            {submitted ? (
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm">Quote Submitted!</h4>
                <p className="text-xs text-white/60 mt-1">
                  Ravi will review your estimate and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="mt-6 space-y-3">
                <div className="text-xs font-medium text-white/80">Send this scope directly to Ravi:</div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center text-xs py-3 font-semibold disabled:opacity-50"
                >
                  <span>{submitting ? 'Sending Scope...' : 'Request Project Consultation'}</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
