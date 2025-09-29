
import React from 'react';
import type { Option } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface OptionSelectorProps {
  title: string;
  type: 'grid' | 'pills' | 'visual';
  options: Option[];
  selected: string; // this is the ID
  onChange: (value: string) => void; // value is the ID
}

const HeadshotIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 21a6 6 0 0 0-12 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ThreeQuarterIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 21a6 6 0 0 0-12 0" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 16.5c0-2-1.5-4-3.5-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16.5c0-2 1.5-4 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FullBodyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m14 10-2 4-2-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 21.5 12 14l2 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const NaturalIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2v2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 20v2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m4.93 4.93 1.41 1.41" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m17.66 17.66 1.41 1.41" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12h2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m4.93 19.07 1.41-1.41" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m17.66 6.34 1.41-1.41" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


const OptionSelector: React.FC<OptionSelectorProps> = ({ title, type, options, selected, onChange }) => {
  const { t } = useLocalization();

  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      {type === 'grid' && (
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            const name = t(opt.nameKey);
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${isSelected ? 'border-brand-accent-end' : 'border-transparent hover:border-brand-accent-end'}`}
              >
                <img src={opt.img} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                  <span className={`text-xs font-medium text-left ${isSelected ? 'text-brand-accent-end' : 'text-white'}`}>{name}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {type === 'pills' && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            const name = t(opt.nameKey);
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${isSelected ? 'bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
      {type === 'visual' && (
        <div className="flex flex-wrap gap-4">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            const name = t(opt.nameKey);
            
            let visualElement;
            if (opt.id === '1:1') visualElement = <div className="w-10 h-10 border-2 border-current rounded-sm"></div>;
            else if (opt.id === '3:4') visualElement = <div className="w-9 h-12 border-2 border-current rounded-sm"></div>;
            else if (opt.id === '4:3') visualElement = <div className="w-12 h-9 border-2 border-current rounded-sm"></div>;
            else if (opt.id === '3x4_passport') visualElement = <div className="w-9 h-12 border-2 border-current rounded-sm"></div>;
            else if (opt.id === '4x6_passport') visualElement = <div className="w-8 h-12 border-2 border-current rounded-sm"></div>;
            else if (opt.id === 'Headshot') visualElement = <HeadshotIcon />;
            else if (opt.id === '3/4 Angle') visualElement = <ThreeQuarterIcon />;
            else if (opt.id === 'Full Body') visualElement = <FullBodyIcon />;
            else if (opt.id === 'Natural') visualElement = <NaturalIcon />;

            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`flex flex-col items-center gap-2 p-2 rounded-md transition-colors w-20 text-center ${isSelected ? 'text-brand-accent-end bg-brand-accent-end/10' : 'text-brand-subtle hover:text-white hover:bg-brand-muted/50'}`}
              >
                <div className="h-12 flex items-center justify-center">
                   {visualElement}
                </div>
                <span className="text-xs font-medium">{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionSelector;