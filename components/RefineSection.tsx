
import React from 'react';
import type { PortraitOptions } from '../types';
import { MALE_HAIRSTYLES, FEMALE_HAIRSTYLES } from '../constants';
import { useLocalization } from '../context/LocalizationContext';
import ImageUploader from './ImageUploader';

interface RefineSectionProps {
  options: PortraitOptions;
  setOptions: React.Dispatch<React.SetStateAction<PortraitOptions>>;
}

const RefineSection: React.FC<RefineSectionProps> = ({ options, setOptions }) => {
  const { t } = useLocalization();

  const handleHairstyleClick = (hairstylePrompt: string) => {
    const newPrompt = `Change hairstyle to ${hairstylePrompt}.`;
    setOptions(prev => ({...prev, refinePrompt: prev.refinePrompt ? `${prev.refinePrompt}. ${newPrompt}` : newPrompt }));
  };
  
  return (
    <div className="border-t border-brand-muted pt-6 mt-6">
      <h3 className="font-semibold mb-2">{t('refineTitle')}</h3>
      <p className="text-xs text-brand-subtle mb-3">{t('refineDesc')}</p>
      <textarea
        placeholder={t('refinePlaceholder')}
        value={options.refinePrompt}
        onChange={(e) => setOptions(prev => ({ ...prev, refinePrompt: e.target.value }))}
        rows={3}
        className="w-full bg-slate-800 border border-brand-muted rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent-end focus:border-brand-accent-end transition"
      />

      <div className="flex items-center my-4">
          <hr className="flex-grow border-brand-muted" />
          <span className="px-2 text-xs text-brand-subtle">{t('outfitOr')}</span>
          <hr className="flex-grow border-brand-muted" />
      </div>
      <ImageUploader
          title={t('uploadHairstyle')}
          files={options.hairstyleImage ? [options.hairstyleImage] : []}
          onFilesChange={(files) => setOptions(prev => ({ ...prev, hairstyleImage: files[0] || null }))}
          maxFiles={1}
          compact
      />

      <p className="text-xs text-brand-subtle my-3">{t('refineFemaleHairstyle')}</p>
       <div className="flex flex-wrap gap-2">
          {FEMALE_HAIRSTYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleHairstyleClick(style.prompt)}
              className="px-3 py-1.5 text-xs rounded-full transition-colors bg-slate-700 hover:bg-slate-600"
            >
              {t(style.nameKey)}
            </button>
          ))}
      </div>

      <p className="text-xs text-brand-subtle my-3 pt-2">{t('refineMaleHairstyle')}</p>
       <div className="flex flex-wrap gap-2">
          {MALE_HAIRSTYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => handleHairstyleClick(style.prompt)}
              className="px-3 py-1.5 text-xs rounded-full transition-colors bg-slate-700 hover:bg-slate-600"
            >
              {t(style.nameKey)}
            </button>
          ))}
        </div>
    </div>
  );
};

export default RefineSection;