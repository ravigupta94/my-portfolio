'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

const PROMPT_SUGGESTIONS = [
  { icon: '📄', label: 'Resume / CV', prompt: 'Can I see Ravi\'s official resume or CV?' },
  { icon: '🚀', label: 'Top Projects', prompt: 'Tell me about Ravi\'s top featured projects.' },
  { icon: '💼', label: 'Hire Ravi', prompt: 'How can I hire Ravi or ARintelligenceX for a project?' },
  { icon: '💰', label: 'Pricing Estimate', prompt: 'How much would a custom web app or SaaS platform cost?' },
  { icon: '🏢', label: 'ARintelligenceX', prompt: 'What services does ARintelligenceX offer?' },
];

export default function RaviAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a unique session ID for the user's visit
    let id = sessionStorage.getItem('ravi-ai-session');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('ravi-ai-session', id);
    }
    setSessionId(id);
  }, []);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/ai/chat',
    body: { sessionId },
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleChipClick = (promptText: string) => {
    if (isLoading) return;
    append({
      role: 'user',
      content: promptText,
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[var(--primary)] text-white shadow-2xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Ravi AI Assistant"
      >
        <MessageCircle size={26} />
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0a0a0f]"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] bg-[var(--bg)] border border-[var(--border-dark)] rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        } glass-card overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-dark)] bg-white/5 dark:bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm text-[var(--text-primary)]">Ravi AI Assistant</h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Ask anything about Ravi & ARintelligenceX</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-[var(--border-dark)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--secondary)]/20 flex items-center justify-center text-[var(--primary)]">
                <Bot size={28} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">
                  Hi! I&apos;m Ravi&apos;s AI Assistant.
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  I can answer questions about his software projects, pricing, tech stack, and ARintelligenceX.
                </p>
              </div>

              {/* Suggested Chips */}
              <div className="w-full space-y-2 pt-2">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] text-left px-1">
                  Suggested topics:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROMPT_SUGGESTIONS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleChipClick(item.prompt)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-[var(--primary)]/15 border border-white/10 hover:border-[var(--primary)]/40 text-[var(--text-primary)] transition-all duration-200 text-left flex items-center gap-1.5"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[88%] ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs ${
                      m.role === 'user'
                        ? 'bg-[var(--border-dark)] text-white/70'
                        : 'bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white'
                    }`}
                  >
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[var(--border-dark)] text-[var(--text-primary)] rounded-tr-sm'
                        : 'bg-[var(--primary)]/10 text-[var(--text-primary)] rounded-tl-sm border border-[var(--primary)]/20'
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
                              className="text-[var(--primary)] hover:underline font-medium"
                            />
                          ),
                          p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                          ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                          li: ({ node, ...props }) => <li {...props} className="text-xs sm:text-sm" />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
                <Bot size={14} />
              </div>
              <div className="p-3 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[var(--primary)]" />
                <span className="text-xs text-[var(--text-secondary)]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-[var(--border-dark)] bg-white/5 dark:bg-black/20"
        >
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything about projects or hiring..."
              className="w-full bg-[var(--bg)] border border-[var(--border-dark)] rounded-full pl-4 pr-11 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--text-muted)]"
              disabled={isLoading || !sessionId}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !sessionId}
              className="absolute right-1.5 p-2 rounded-full bg-[var(--primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--secondary)] transition-colors"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
