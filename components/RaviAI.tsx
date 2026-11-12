'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Loader2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

interface PromptItem {
  icon: string;
  label: string;
  prompt: string;
  category?: string;
}

const PROMPT_SUGGESTIONS: PromptItem[] = [
  { icon: '📄', label: 'Resume / CV', prompt: "Can I see Ravi's official resume or CV?", category: 'Career' },
  { icon: '🚀', label: 'Top Projects', prompt: "Tell me about Ravi's top featured production projects.", category: 'Work' },
  { icon: '💼', label: 'Hire Ravi', prompt: 'How can I hire Ravi or ARintelligenceX for a project?', category: 'Contact' },
  { icon: '💰', label: 'Pricing Estimate', prompt: 'How much would a custom web application or MVP cost?', category: 'Pricing' },
  { icon: '🛠️', label: 'Core Tech Stack', prompt: 'What technologies and frameworks does Ravi specialize in?', category: 'Skills' },
  { icon: '🏢', label: 'ARintelligenceX', prompt: 'What services does Ravi’s company ARintelligenceX provide?', category: 'Company' },
];

const QUICK_ACTIONS = [
  { label: '📄 Resume', prompt: "Show me Ravi's official resume link." },
  { label: '💼 Hire Me', prompt: 'How can I hire Ravi for freelance or contract work?' },
  { label: '🚀 Projects', prompt: 'What are the main projects Ravi has built?' },
  { label: '💰 Pricing', prompt: 'What are the estimated costs for developing a web app?' },
  { label: '📞 Contact', prompt: "What is Ravi's email and phone number?" },
];

export default function RaviAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let id = sessionStorage.getItem('ravi-ai-session');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('ravi-ai-session', id);
    }
    setSessionId(id);
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages,
  } = useChat({
    api: '/api/ai/chat',
    body: { sessionId },
  });

  // Synthesize futuristic UI sounds via native Web Audio API (zero audio files needed)
  const playSound = (type: 'send' | 'receive') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'send') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(780, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Audio autoplay gracefully handled
    }
  };

  // Play sound when AI completes answering
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      playSound('receive');
    }
  }, [messages.length]);

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleChipClick = (promptText: string) => {
    if (isLoading) return;
    playSound('send');
    append({
      role: 'user',
      content: promptText,
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    playSound('send');
    handleSubmit(e);
  };

  const handleResetChat = () => {
    if (isLoading) return;
    setMessages([]);
    const newId = uuidv4();
    sessionStorage.setItem('ravi-ai-session', newId);
    setSessionId(newId);
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Action Button & Teaser Bubble */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
        {/* Teaser Bubble (appears above button when chat is closed) */}
        {!isOpen && showTeaser && (
          <div
            className="mb-3 flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2 rounded-2xl bg-[#0e0f1a]/95 border border-violet-500/40 text-xs text-white shadow-2xl backdrop-blur-xl animate-fade-in group hover:border-violet-400 transition-all cursor-pointer max-w-[260px] sm:max-w-none"
            onClick={() => setIsOpen(true)}
            style={{ animation: 'bounce 3s infinite' }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-violet-300 flex items-center gap-1">
                <Sparkles size={11} className="text-violet-400" /> Have a project in mind?
              </span>
              <span className="text-[11px] text-gray-300">Chat live with Ravi&apos;s AI Assistant</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors ml-1"
              aria-label="Dismiss teaser"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`relative p-4 rounded-full text-white shadow-[0_0_35px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group ${
            isOpen
              ? 'bg-[#181825] border border-violet-500/40'
              : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 hover:shadow-[0_0_45px_rgba(6,182,212,0.6)]'
          }`}
          aria-label={isOpen ? 'Close Ravi AI Assistant' : 'Open Ravi AI Assistant'}
        >
          {isOpen ? (
            <X size={24} className="transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <>
              <MessageCircle size={26} className="transition-transform duration-200 group-hover:scale-110" />
              {/* Online pulse indicator */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0a0a0f]"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Modern High-End Chat Window */}
      <div
        className={`fixed bottom-20 sm:bottom-24 right-3 sm:right-6 w-[94vw] sm:w-[440px] h-[600px] sm:h-[620px] max-h-[88vh] bg-[#0c0d18]/95 border border-violet-500/30 rounded-3xl shadow-[0_25px_80px_-15px_rgba(124,58,237,0.45)] z-50 flex flex-col transition-all duration-300 transform origin-bottom-right overflow-hidden backdrop-blur-2xl ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle Ambient Glowing Background Orb */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* ─── Header Bar ────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-950/40 via-black/40 to-indigo-950/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Glowing Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-violet-500/30">
                <Bot size={20} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c0d18] shadow-sm animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-1">
                  Ravi AI
                  <span className="inline-flex items-center text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded-full border border-violet-500/30">
                    <Sparkles size={9} className="mr-0.5 text-violet-400" /> Bot
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Technical Support & Full Stack Architect
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 text-gray-400">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label="Toggle audio effects"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-gray-500" />}
            </button>

            {/* Clear Chat */}
            {messages.length > 0 && (
              <button
                onClick={handleResetChat}
                disabled={isLoading}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-amber-300 transition-colors disabled:opacity-40"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors ml-0.5"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ─── Messages Area ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.length === 0 ? (
            /* Enhanced Welcome / Empty State */
            <div className="h-full flex flex-col justify-between py-2 space-y-4">
              <div className="text-center pt-2">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-cyan-500/20 border border-violet-500/30 text-violet-400 mb-3 shadow-lg">
                  <Sparkles size={28} />
                </div>
                <h4 className="font-bold text-base text-white mb-1">
                  Welcome to Ravi&apos;s AI Assistant!
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[320px] mx-auto">
                  Ask me anything about Ravi Gupta&apos;s experience, live apps, project quotes, or ARintelligenceX services.
                </p>

                {/* 3 High-Tech Value Pills */}
                <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-gray-300">
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                    <Zap size={11} className="text-amber-400" /> Instant 24/7
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-400" /> Verified Data
                  </span>
                </div>
              </div>

              {/* Categorized Prompt Chips */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400/90">
                    Suggested Questions
                  </span>
                  <span className="text-[10px] text-gray-500">Tap to send</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PROMPT_SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleChipClick(item.prompt)}
                      className="text-xs p-2.5 rounded-xl bg-white/[0.04] hover:bg-violet-600/15 border border-white/10 hover:border-violet-500/40 text-gray-200 hover:text-white transition-all duration-200 text-left flex items-start gap-2 group hover:-translate-y-0.5"
                    >
                      <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[11px] text-white flex items-center justify-between">
                          <span>{item.label}</span>
                          <ChevronRight size={12} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.prompt}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Message Bubbles */
            <>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 max-w-[92%] ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 shrink-0 rounded-xl flex items-center justify-center text-xs mt-0.5 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white'
                        : 'bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 border border-violet-500/30 text-violet-300'
                    }`}
                  >
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  {/* Bubble Container */}
                  <div className="flex flex-col group relative">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-violet-600/20'
                          : 'bg-white/[0.05] text-gray-100 rounded-tl-sm border border-violet-500/20 backdrop-blur-md shadow-sm'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-medium hover:underline transition-colors"
                              >
                                <span>{props.children}</span>
                                <ExternalLink size={11} className="inline ml-0.5 opacity-80" />
                              </a>
                            ),
                            p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1 text-gray-200" />,
                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1 text-gray-200" />,
                            li: ({ node, ...props }) => <li {...props} className="text-xs sm:text-sm" />,
                            strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-white" />,
                            code: ({ node, ...props }) => (
                              <code
                                {...props}
                                className="px-1.5 py-0.5 rounded bg-black/40 text-violet-300 font-mono text-[11px] border border-white/10"
                              />
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Metadata & Actions row */}
                    <div
                      className={`flex items-center gap-2 mt-1 px-1 text-[10px] text-gray-500 ${
                        m.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{formatTime()}</span>

                      {/* Bot Copy Button */}
                      {m.role === 'assistant' && (
                        <button
                          onClick={() => handleCopyMessage(m.id, m.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-violet-400 p-0.5 rounded"
                          title="Copy reply text"
                          aria-label="Copy message"
                        >
                          {copiedId === m.id ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Check size={11} /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy size={11} /> Copy
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Typing / Thinking Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600/30 to-cyan-500/30 border border-violet-500/30 flex items-center justify-center text-violet-300 mt-0.5">
                <Bot size={13} />
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-violet-500/20 rounded-tl-sm flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-400 font-medium">Ravi AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Quick Suggestion Chips (Available during chat) ──────── */}
        {messages.length > 0 && !isLoading && (
          <div className="px-3 py-1.5 border-t border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleChipClick(action.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-[11px] text-gray-300 hover:text-white transition-colors shrink-0"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── Input Area ────────────────────────────────────────────── */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 border-t border-white/10 bg-gradient-to-b from-black/20 to-black/50"
        >
          <div className="relative flex items-center rounded-2xl bg-white/[0.05] border border-white/15 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about projects, pricing, hiring, or skills..."
              className="w-full bg-transparent pl-4 pr-11 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder:text-gray-500"
              disabled={isLoading || !sessionId}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !sessionId}
              className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all active:scale-95 flex items-center justify-center"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Sparkles size={10} className="text-violet-400" />
              Instant AI Assistant
            </span>
            <span>Press Enter to send</span>
          </div>
        </form>
      </div>
    </>
  );
}
