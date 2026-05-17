import { Component, type ReactNode } from 'react';
import { reportError } from '../lib/sentry';

// A single JS error inside a component subtree (a bad article row, a stale
// Supabase shape, a TTS bug on an obscure browser) used to blank the whole
// page in React 19. This catches it, logs to the console for debugging,
// and shows a recoverable fallback so the user can navigate away.

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('[ErrorBoundary]', error, info);
    // Forward to Sentry. No-op unless VITE_SENTRY_DSN is configured.
    reportError(error, { componentStack: info.componentStack });
  }

  private reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-paper-soft dark:bg-ink-800 border border-slate/20 dark:border-ink-700 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate dark:text-mist mb-5">
            This page hit an unexpected error. Try reloading, or go back to the
            home page. The rest of the app is still fine.
          </p>
          <pre className="text-[11px] text-left bg-slate/5 dark:bg-ink-900/60 border border-slate/15 dark:border-ink-700 rounded-lg p-3 mb-5 overflow-x-auto">
            {this.state.error.message}
          </pre>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={this.reset}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm"
            >
              Try again
            </button>
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="px-4 py-2 rounded-xl border border-slate/30 dark:border-ink-700 text-slate dark:text-mist hover:border-brand-500 hover:text-brand-500 transition-colors text-sm"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
