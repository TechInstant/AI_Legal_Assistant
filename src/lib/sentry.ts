// Sentry bootstrap. No-op when VITE_SENTRY_DSN isn't set, so dev builds
// (and forks without a Sentry account) work unchanged. Set the env var in
// Netlify when you're ready to receive crash reports in production.

import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const ENV =
  (import.meta.env.VITE_SENTRY_ENV as string | undefined) ||
  (import.meta.env.MODE as string);

export const initSentry = (): void => {
  if (!DSN) return;
  Sentry.init({
    dsn: DSN,
    environment: ENV,
    // Sampling: in prod, send every error but only 10% of slow performance
    // traces. Bump tracesSampleRate if you want richer perf data.
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    // Skip noise we can't act on.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // SpeechSynthesis quirks on Safari often surface as TypeError.
      /speechSynthesis/i,
    ],
  });
};

/** Hook for the ErrorBoundary to forward caught errors to Sentry. */
export const reportError = (
  err: unknown,
  context?: Record<string, unknown>,
): void => {
  if (!DSN) return;
  Sentry.captureException(err, { extra: context });
};
