import { useCallback, useEffect, useRef, useState } from 'react';

// Minimal types for the Web Speech API (not in standard TS lib).
type SpeechRecognitionResult = { transcript: string; isFinal: boolean };
interface SpeechRecognitionEvent extends Event {
  results: ArrayLike<ArrayLike<SpeechRecognitionResult>> & {
    length: number;
    [index: number]: ArrayLike<SpeechRecognitionResult>;
  };
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getRecognition = (): SpeechRecognitionCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

export interface UseVoiceOptions {
  lang?: string;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
}

export const useVoice = ({
  lang = 'en-US',
  onTranscript,
}: UseVoiceOptions = {}) => {
  const RecognitionCtor = getRecognition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportsRecognition = !!RecognitionCtor;
  const supportsSynthesis =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // ---------- Recognition (mic) ----------
  const startListening = useCallback(() => {
    if (!RecognitionCtor) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    setError(null);
    const rec = new RecognitionCtor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i][0];
        if (e.results[i] && (e.results[i] as unknown as { isFinal: boolean }).isFinal) {
          finalTranscript += result.transcript;
        } else {
          interimTranscript += result.transcript;
        }
      }
      const text = finalTranscript || interimTranscript;
      if (text) onTranscript?.(text, !!finalTranscript);
    };
    rec.onerror = (e: Event) => {
      const err = (e as unknown as { error?: string }).error;
      setError(err ? `Voice input error: ${err}` : 'Voice input failed.');
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }, [RecognitionCtor, lang, onTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ---------- Synthesis (TTS) ----------
  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number }) => {
      if (!supportsSynthesis) {
        setError("Voice output isn't supported in this browser.");
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = opts?.rate ?? 0.95;
      u.pitch = opts?.pitch ?? 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [supportsSynthesis, lang],
  );

  const stopSpeaking = useCallback(() => {
    if (!supportsSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supportsSynthesis]);

  return {
    listening,
    speaking,
    error,
    supportsRecognition,
    supportsSynthesis,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
};
