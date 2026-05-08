import React from 'react';
import { Globe } from 'lucide-react';
import { regionLabel, type Region } from '../data/constitutions';

const REGIONS: Region[] = [
  'americas',
  'europe',
  'africa',
  'mideast',
  'asia',
  'oceania',
  'arctic',
];

const REGION_DOT: Record<Region, string> = {
  africa: 'bg-region-africa',
  asia: 'bg-region-asia',
  europe: 'bg-region-europe',
  americas: 'bg-region-americas',
  oceania: 'bg-region-oceania',
  arctic: 'bg-region-arctic',
  mideast: 'bg-region-mideast',
};

interface ContinentSelectorProps {
  value: Region | 'all';
  onChange: (next: Region | 'all') => void;
  className?: string;
}

export const ContinentSelector: React.FC<ContinentSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const baseChip =
    'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm transition-all duration-200';
  const inactive =
    'border-slate/30 dark:border-ink-700 text-slate dark:text-mist hover:text-brand-500 hover:border-brand-500/60';
  const active =
    'border-brand-500 text-brand-500 bg-brand-500/5 shadow-[0_0_0_3px_rgba(36,119,45,0.10)]';

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`${baseChip} ${value === 'all' ? active : inactive}`}
      >
        <Globe className="w-3.5 h-3.5" />
        All continents
      </button>
      {REGIONS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`${baseChip} ${value === r ? active : inactive}`}
        >
          <span className={`w-2 h-2 rounded-full ${REGION_DOT[r]}`} />
          {regionLabel[r]}
        </button>
      ))}
    </div>
  );
};
