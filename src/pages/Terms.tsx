import React from 'react';
import { Card } from '../components/Card';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="p-8 space-y-6 bg-white/95 dark:bg-ink-800/95">
        <h1 className="text-3xl font-serif">Terms of Service</h1>
        <p className="text-sm text-slate dark:text-mist">Last updated: June 2026</p>
        
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-slate dark:text-mist">
            By accessing or using ConstIntell (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. Educational Purposes Only</h2>
          <p className="text-slate dark:text-mist">
            <strong>Disclaimer:</strong> ConstIntell is an educational tool designed to help users explore constitutional texts. It is NOT a substitute for professional legal advice. The AI-generated summaries and answers should not be relied upon for legal compliance or decision-making.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <p className="text-slate dark:text-mist">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Termination</h2>
          <p className="text-slate dark:text-mist">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </Card>
    </div>
  );
};


