import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_placeholder";

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    window.location.href = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(user.email || '')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif mb-4">
          {t('pricing.title')}
        </h1>
        <p className="text-lg text-slate dark:text-mist">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
        <Card className="p-8 border-slate/20">
          <h2 className="text-2xl font-semibold mb-2">{t('pricing.basic')}</h2>
          <div className="text-4xl font-bold mb-6">{t('pricing.basic_price')} <span className="text-lg text-slate font-normal">{t('pricing.forever')}</span></div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate" />
              <span>{t('pricing.feature_all_constitutions')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate" />
              <span>{t('pricing.feature_voice')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate" />
              <span>{t('pricing.feature_bookmarks')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate" />
              <span>{t('pricing.feature_free_queries')}</span>
            </li>
          </ul>

          <Button variant="secondary" className="w-full py-4" onClick={() => navigate('/explorer')}>
            {t('pricing.start_reading')}
          </Button>
        </Card>

        <Card className="p-8 border-iris-500 shadow-2xl shadow-iris-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-iris-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            {t('pricing.recommended')}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-iris-500" />
            <h2 className="text-2xl font-semibold text-iris-500">{t('pricing.pro')}</h2>
          </div>
          <div className="text-4xl font-bold mb-6">{t('pricing.pro_price')} <span className="text-lg text-slate font-normal">{t('pricing.per_month')}</span></div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-iris-500" />
              <span className="font-medium">{t('pricing.feature_everything')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-iris-500" />
              <span>{t('pricing.feature_unlimited_ai')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-iris-500" />
              <span>{t('pricing.feature_comparative')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-iris-500" />
              <span>{t('pricing.feature_export')}</span>
            </li>
          </ul>

          <Button className="w-full py-4" onClick={handleSubscribe}>
            {t('pricing.subscribe')}
          </Button>
          <p className="text-xs text-center text-slate mt-4">
            {t('pricing.secure_checkout')}
          </p>
        </Card>
      </div>
    </div>
  );
};
