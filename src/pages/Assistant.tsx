import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../components/Card';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { answer, type CitedAnswer } from '../services/ai';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: CitedAnswer['hits'];
  confidence?: CitedAnswer['confidence'];
};

const SUGGESTIONS = [
  'What is the right to life in Nigeria?',
  'Compare freedom of speech in the US and India',
  'What does Germany say about human dignity?',
  'Explain Japan\'s Article 9',
];

const confidenceStyles: Record<NonNullable<Message['confidence']>, string> = {
  high: 'text-world-forest bg-world-forest/10 border-world-forest/30',
  medium: 'text-world-earth bg-world-earth/10 border-world-earth/30',
  low: 'text-region-americas bg-region-americas/10 border-region-americas/30',
};

const renderMarkdownish = (text: string) =>
  text.split('\n').map((line, i) => {
    if (line.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-world-ocean pl-4 italic text-brand-slate dark:text-brand-mist my-2"
        >
          {line.slice(2)}
        </blockquote>
      );
    }
    if (line.startsWith('• ')) {
      return (
        <div key={i} className="ml-2 my-1">
          {renderInline(line)}
        </div>
      );
    }
    if (line.startsWith('_') && line.endsWith('_')) {
      return (
        <p key={i} className="text-xs italic text-brand-slate mt-2">
          {line.slice(1, -1)}
        </p>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return (
      <p key={i} className="my-1">
        {renderInline(line)}
      </p>
    );
  });

const renderInline = (line: string) => {
  // Render **bold** runs
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-world-deep-ocean dark:text-world-sand">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
};

export const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello. I am your Constitutional Intelligence Assistant. I will only quote from the indexed constitutional corpus and always cite my sources. Ask me about a right, a country, or compare two jurisdictions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Small artificial latency so the UX reads as "thinking"; the search itself is sync.
    setTimeout(() => {
      const result = answer(text);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: result.reply,
        citations: result.hits,
        confidence: result.confidence,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-180px)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-world-ocean" />
          <h1 className="text-2xl md:text-3xl font-serif text-world-deep-ocean dark:text-world-sand m-0">
            AI Legal Assistant
          </h1>
        </div>
        <p className="text-brand-slate dark:text-brand-mist text-sm">
          Retrieval-grounded answers from the bundled constitutional corpus. AI responses are informational and not legal advice.
        </p>
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-brand-slate/30 text-brand-slate dark:text-brand-mist hover:border-world-ocean hover:text-world-ocean transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-brand-slate/20 bg-white/40 dark:bg-brand-carbon/40">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-brand-slate/20 text-brand-slate dark:text-brand-mist'
                    : 'bg-world-ocean/20 text-world-ocean'
                }`}
              >
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div
                className={`${
                  msg.role === 'user'
                    ? 'bg-world-ocean text-white rounded-2xl rounded-tr-none'
                    : 'bg-white dark:bg-world-navy/60 border border-brand-slate/20 rounded-2xl rounded-tl-none text-world-deep-ocean dark:text-brand-mist'
                } p-4 max-w-[88%] space-y-2 shadow-sm leading-relaxed text-sm`}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-1">{renderMarkdownish(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}

                {msg.role === 'assistant' && msg.confidence && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${confidenceStyles[msg.confidence]}`}
                    >
                      Confidence: {msg.confidence}
                    </span>
                    {msg.citations?.map((c) => (
                      <span
                        key={c.article.id}
                        className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-world-ocean/40 text-world-ocean bg-world-ocean/5"
                      >
                        {c.constitution.flag} {c.article.article_number}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-world-ocean/20 flex items-center justify-center shrink-0 text-world-ocean">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white dark:bg-world-navy/60 border border-brand-slate/20 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-world-ocean" />
                <span className="text-brand-slate dark:text-brand-mist text-sm">
                  Searching constitutional corpus…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-brand-slate/5 dark:bg-brand-carbon/30 border-t border-brand-slate/20">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && ask(input)}
              placeholder="Ask: 'What is freedom of speech in Nigeria?' or 'Compare US and India'…"
              className="w-full bg-white dark:bg-world-navy/50 border border-brand-slate/30 rounded-xl py-4 pl-4 pr-14 text-world-deep-ocean dark:text-brand-ivory outline-none focus:border-world-ocean transition-colors shadow-sm text-sm"
            />
            <Button
              onClick={() => ask(input)}
              disabled={loading || !input.trim()}
              className="absolute right-2 px-3 py-2 rounded-lg"
              variant="primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
