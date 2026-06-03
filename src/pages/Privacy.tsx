import React from 'react';
import { Card } from '../components/Card';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="p-8 space-y-6 bg-white/95 dark:bg-ink-800/95">
        <h1 className="text-3xl font-serif">Privacy Policy</h1>
        <p className="text-sm text-slate dark:text-mist">Last updated: June 2026</p>
        
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p className="text-slate dark:text-mist">
            When you create an account, we collect your email address and name (optional) for authentication purposes. We also store the bookmarks and notes you create within the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p className="text-slate dark:text-mist">
            Your information is used solely to provide the services of LexIntell (bookmarking articles, saving your recent views). We do not sell or share your personal information with third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Security</h2>
          <p className="text-slate dark:text-mist">
            We use industry-standard security measures to protect your account and data. However, no internet transmission is completely secure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Contact Us</h2>
          <p className="text-slate dark:text-mist">
            If you have any questions about this Privacy Policy, please contact us at privacy@lexintell.com.
          </p>
        </section>
      </Card>
    </div>
  );
};
