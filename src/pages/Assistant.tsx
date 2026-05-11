import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/Card';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Play,
  StopCircle,
} from 'lucide-react';
import { Button } from '../components/Button';
import { answerSmart, type CitedAnswer } from '../services/ai';
import { useVoice } from '../lib/useVoice';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plain?: string; // text suitable for TTS (no markdown, no source-list lines)
  citations?: CitedAnswer['hits'];
  confidence?: CitedAnswer['confidence'];
  degraded?: CitedAnswer['degraded'];
};

const SUGGESTIONS = [
  'What is the right to life in Nigeria?',
  'Compare freedom of speech in the US and India',
  'What does Germany say about human dignity?',
  "Explain Japan's Article 9",
];

const confidenceStyles: Record<NonNullable<Message['confidence']>, string> = {
  high: 'text-sage-500 bg-sage-500/10 border-sage-500/30',
  medium: 'text-honey-500 bg-honey-500/10 border-honey-500/30',
  low: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
};

const degradedNotice: Record<NonNullable<Message['degraded']>, string> = {
  'llm-unavailable':
    'AI generation is temporarily unavailable. Showing the closest matching passage from the indexed corpus instead.',
  'profile-only':
    'No constitutional text is yet indexed for this country — only a basic country profile. The Wikipedia link in the source has fuller information.',
};

const renderMarkdownish = (text: string) =>
  text.split('\n').map((line, i) => {
    if (line.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="border-l-4 border-iris-500 pl-4 italic text-slate dark:text-mist my-2"
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
        <p key={i} className="text-xs italic text-slate mt-2">
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
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink-100 dark:text-paper">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
};

// Strip markdown-ish formatting + the metadata footer line for cleaner TTS.
const cleanForSpeech = (text: string) =>
  text
    .replace(/_AI responses[^_]+_/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[•>]/g, '')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();

export const Assistant: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello. I am your Constitutional Intelligence Assistant. I will only quote from the indexed constitutional corpus and always cite my sources. Ask me by typing — or tap the microphone to speak your question.',
      plain:
        'Hello. I am your Constitutional Intelligence Assistant. I will only quote from the indexed constitutional corpus and always cite my sources.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const voice = useVoice({
    onTranscript: (transcript, isFinal) => {
      setInput(transcript);
      if (isFinal) {
        // Auto-send a final spoken transcript
        ask(transcript);
      }
    },
  });

  // Track when speech ends to clear the speaking-id badge
  useEffect(() => {
    if (!voice.speaking) setActiveSpeakingId(null);
  }, [voice.speaking]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  // If we landed here with ?q=…, ask it once.
  const askedFromUrl = useRef(false);
  useEffect(() => {
    if (askedFromUrl.current) return;
    const q = searchParams.get('q');
    if (q && q.trim()) {
      askedFromUrl.current = true;
      ask(q);
      const next = new URLSearchParams(searchParams);
      next.delete('q');
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ask = async (q: string) => {
    const text = q.trim();
    if (!text || loading) return;
    voice.stopListening();

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    const aiId = `a-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: aiId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setLoading(true);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await answerSmart({
        query: text,
        signal: controller.signal,
        onSources: (sources) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiId ? { ...m, citations: sources } : m,
            ),
          );
        },
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiId ? { ...m, content: m.content + token } : m,
            ),
          );
        },
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content: result.reply,
                plain: cleanForSpeech(result.reply),
                citations: result.hits,
                confidence: result.confidence,
                degraded: result.degraded,
              }
            : m,
        ),
      );

      if (autoSpeak) {
        const plain = cleanForSpeech(result.reply);
        if (plain) {
          setActiveSpeakingId(aiId);
          voice.speak(plain);
        }
      }
    } catch (err) {
      console.error('[assistant]', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content:
                  m.content ||
                  'Sorry — I couldn\'t generate a response. Please try again.',
              }
            : m,
        ),
      );
    } finally {
      setLoading(false);
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopGenerating = () => {
    abortRef.current?.abort();
  };

  const handleMessageSpeak = (msg: Message) => {
    if (activeSpeakingId === msg.id && voice.speaking) {
      voice.stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }
    if (msg.plain) {
      setActiveSpeakingId(msg.id);
      voice.speak(msg.plain);
    }
  };

  const toggleMic = () => {
    if (voice.listening) voice.stopListening();
    else voice.startListening();
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 min-h-0">
      {/* Header */}
      <div className="on-map mb-3 md:mb-5 flex items-start sm:items-end justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-iris-500 shrink-0" />
            <h1 className="m-0 text-xl sm:text-2xl md:text-3xl truncate">
              AI Legal Assistant
            </h1>
          </div>
          <p className="text-slate dark:text-mist text-[12px] sm:text-sm">
            Ask anything about constitutional law — every answer carries
            cited sources.
          </p>
        </div>

        {voice.supportsSynthesis && (
          <button
            onClick={() => {
              if (autoSpeak) voice.stopSpeaking();
              setAutoSpeak((v) => !v);
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border text-[11px] sm:text-xs transition-colors shrink-0 ${
              autoSpeak
                ? 'border-sage-500 text-sage-500 bg-sage-500/10'
                : 'border-slate/30 dark:border-ink-700 text-slate dark:text-mist hover:border-iris-500 hover:text-iris-500'
            }`}
            title="Auto-read assistant replies"
            aria-label={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">Auto-speak {autoSpeak ? 'on' : 'off'}</span>
            <span className="sm:hidden">{autoSpeak ? 'On' : 'Off'}</span>
          </button>
        )}
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate/30 dark:border-ink-700 text-slate dark:text-mist hover:border-iris-500 hover:text-iris-500 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {voice.error && (
        <div className="mb-3 text-xs px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500">
          {voice.error}
        </div>
      )}

      <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-[55vh]">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 sm:gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-slate/20 text-slate dark:text-mist'
                    : 'bg-iris-500/15 text-iris-500'
                }`}
              >
                {msg.role === 'user'
                  ? <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <div
                className={`${
                  msg.role === 'user'
                    ? 'bg-iris-500 text-white rounded-2xl rounded-tr-none'
                    : 'bg-paper-soft dark:bg-ink-900/60 border border-slate/15 dark:border-ink-700 rounded-2xl rounded-tl-none text-ink-100 dark:text-paper'
                } p-3 sm:p-4 max-w-[85%] sm:max-w-[88%] space-y-2 shadow-sm leading-relaxed text-[13px] sm:text-sm break-words`}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-1">{renderMarkdownish(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}

                {msg.role === 'assistant' && msg.degraded && (
                  <div
                    className={`text-[11px] leading-snug px-3 py-2 rounded-lg border ${
                      msg.degraded === 'llm-unavailable'
                        ? 'border-honey-500/40 bg-honey-500/10 text-honey-700 dark:text-honey-100'
                        : 'border-slate/30 bg-slate/5 text-slate dark:text-mist'
                    }`}
                  >
                    {degradedNotice[msg.degraded]}
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {msg.confidence && (
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${confidenceStyles[msg.confidence]}`}
                      >
                        Confidence: {msg.confidence}
                      </span>
                    )}
                    {msg.citations?.map((c) => (
                      <span
                        key={c.article.id}
                        className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-iris-500/40 text-iris-500 bg-iris-500/5"
                      >
                        {c.constitution.flag} {c.article.article_number}
                      </span>
                    ))}
                    {voice.supportsSynthesis && msg.plain && (
                      <button
                        onClick={() => handleMessageSpeak(msg)}
                        className="ml-auto flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-slate/25 dark:border-ink-700 text-slate dark:text-mist hover:border-iris-500 hover:text-iris-500 transition-colors"
                      >
                        {activeSpeakingId === msg.id && voice.speaking ? (
                          <>
                            <Square className="w-3 h-3 fill-current" /> Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" /> Listen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Show retrieval indicator only before any tokens arrive in the latest msg */}
          {loading &&
            !messages[messages.length - 1]?.content &&
            messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex gap-2 sm:gap-3 -mt-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-iris-500/15 flex items-center justify-center shrink-0 text-iris-500">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="bg-paper-soft dark:bg-ink-900/60 border border-slate/15 dark:border-ink-700 rounded-2xl rounded-tl-none p-3 sm:p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-iris-500" />
                  <span className="text-slate dark:text-mist text-xs sm:text-sm">
                    Finding cited sources…
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Input row */}
        <div className="p-2.5 sm:p-3 md:p-4 bg-slate/5 dark:bg-ink-900/40 border-t border-slate/15 dark:border-ink-700">
          <div className="flex items-center gap-2">
            {voice.supportsRecognition && (
              <button
                onClick={toggleMic}
                title={voice.listening ? 'Stop listening' : 'Speak your question'}
                aria-label={voice.listening ? 'Stop listening' : 'Speak your question'}
                className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-full flex items-center justify-center border transition-all ${
                  voice.listening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse shadow-[0_0_0_4px_rgba(194,79,110,0.25)]'
                    : 'bg-paper-soft dark:bg-ink-800 text-slate dark:text-mist border-slate/25 dark:border-ink-700 hover:border-iris-500 hover:text-iris-500'
                }`}
              >
                {voice.listening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            )}

            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && ask(input)}
                placeholder={
                  voice.listening ? 'Listening…' : 'Ask a constitutional question…'
                }
                disabled={streaming}
                className="w-full bg-paper-soft dark:bg-ink-800 border border-slate/25 dark:border-ink-700 rounded-xl py-2.5 sm:py-3 pl-3 sm:pl-4 pr-12 sm:pr-14 text-ink-100 dark:text-paper outline-none focus:border-iris-500 transition-colors text-sm disabled:opacity-60"
              />
              {streaming ? (
                <button
                  onClick={stopGenerating}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-500/90 flex items-center gap-1 text-xs sm:text-sm"
                  aria-label="Stop generating"
                >
                  <StopCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop</span>
                </button>
              ) : (
                <Button
                  onClick={() => ask(input)}
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg"
                  variant="primary"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {voice.listening && (
            <p className="text-[11px] text-rose-500 mt-2 px-1">
              ● Listening — speak clearly. Tap the mic again to stop.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
