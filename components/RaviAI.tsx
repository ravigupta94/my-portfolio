'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

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

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { sessionId },
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform duration-300 hover:scale-110 z-50 flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Ravi AI Assistant"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-[var(--bg)] border border-[var(--border-dark)] rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        } glass-card overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-dark)] bg-white/5 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h3 className="font-semibold text-sm">Ravi AI Assistant</h3>
              <p className="text-xs text-[var(--text-secondary)]">Ask me about Ravi & his work</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-[var(--border-dark)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--text-secondary)] space-y-4">
              <MessageCircle size={40} className="opacity-20" />
              <p className="text-sm">Hi! I&apos;m Ravi&apos;s AI assistant.<br/>Ask me about his projects, skills, or ARintelligenceX.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                    m.role === 'user'
                      ? 'bg-[var(--border-dark)]'
                      : 'bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] text-white'
                  }`}
                >
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-[var(--border-dark)] text-[var(--text-primary)] rounded-tr-sm'
                      : 'bg-[var(--primary)]/10 text-[var(--text-primary)] rounded-tl-sm border border-[var(--primary)]/20'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline" />
                        ),
                        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <div className="p-3 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-tl-sm flex items-center gap-1">
                <Loader2 size={16} className="animate-spin text-[var(--primary)]" />
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
              placeholder="Ask me anything..."
              className="w-full bg-[var(--bg)] border border-[var(--border-dark)] rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
              disabled={isLoading || !sessionId}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !sessionId}
              className="absolute right-2 p-2 rounded-full bg-[var(--primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--secondary)] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
