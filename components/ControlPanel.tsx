
import React from 'react';
import type { PortraitOptions } from '../types';
import ImageUploader from './ImageUploader';
import OptionSelector from './OptionSelector';
import RefineSection from './RefineSection';
import { STYLES, SHOTS, ASPECT_RATIOS, QUALITIES, OUTFIT_SUGGESTIONS } from '../constants';
import { useLocalization } from '../context/LocalizationContext';

interface ControlPanelProps {
  options: PortraitOptions;
  setOptions: React.Dispatch<React.SetStateAction<PortraitOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
  generated: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions, onGenerate, isLoading, generated }) => {
  const { t } = useLocalization();

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg space-y-8 sticky top-24">
      <ImageUploader
        title={t('uploadTitle')}
        description={t('uploadDesc')}
        files={options.sourceImages}
        onFilesChange={(files) => setOptions(prev => ({ ...prev, sourceImages: files }))}
        maxFiles={3}
      />

      <OptionSelector
        title={t('styleTitle')}
        type="grid"
        options={STYLES}
        selected={options.style}
        onChange={(value) => setOptions(prev => ({ ...prev, style: value }))}
      />

      <OptionSelector
        title={t('shotTitle')}
        type="visual"
        options={SHOTS}
        selected={options.shot}
        onChange={(value) => setOptions(prev => ({ ...prev, shot: value }))}
      />

      <OptionSelector
        title={t('aspectRatioTitle')}
        type="visual"
        options={ASPECT_RATIOS}
        selected={options.aspectRatio}
        onChange={(value) => setOptions(prev => ({ ...prev, aspectRatio: value }))}
      />

      <div>
        <h3 className="font-semibold mb-2">{t('outfitTitle')}</h3>
        <input
          type="text"
          placeholder={t('outfitPlaceholder')}
          value={options.outfitDescription}
          onChange={(e) => setOptions(prev => ({ ...prev, outfitDescription: e.target.value }))}
          className="w-full bg-slate-800 border border-brand-muted rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent-end focus:border-brand-accent-end transition"
        />
        <div className="flex flex-wrap gap-1 mt-2 mb-2">
          {OUTFIT_SUGGESTIONS.map((suggestionKey) => (
            <button
              key={suggestionKey}
              onClick={() => {
                const suggestionText = t(suggestionKey);
                setOptions(prev => ({ ...prev, outfitDescription: prev.outfitDescription ? `${prev.outfitDescription}, ${suggestionText.toLowerCase()}` : suggestionText }))
              }}
              className="px-2 py-1 text-xs rounded-full transition-colors bg-slate-700 hover:bg-slate-600"
            >
              {t(suggestionKey)}
            </button>
          ))}
        </div>
        <div className="flex items-center my-2">
          <hr className="flex-grow border-brand-muted" />
          <span className="px-2 text-xs text-brand-subtle">{t('outfitOr')}</span>
          <hr className="flex-grow border-brand-muted" />
        </div>
        <ImageUploader
          title={t('uploadOutfit')}
          files={options.outfitImage ? [options.outfitImage] : []}
          onFilesChange={(files) => setOptions(prev => ({ ...prev, outfitImage: files[0] || null }))}
          maxFiles={1}
          compact
        />
      </div>

      <OptionSelector
        title={t('qualityTitle')}
        type="pills"
        options={QUALITIES}
        selected={options.quality}
        onChange={(value) => setOptions(prev => ({ ...prev, quality: value }))}
      />
      
      {generated && (
        <RefineSection options={options} setOptions={setOptions} />
      )}
      
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-brand-accent-start to-brand-accent-end hover:opacity-90 disabled:bg-brand-muted text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center text-lg"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('generating')}
          </>
        ) : (
          t('generateButton')
        )}
      </button>

    </div>
  );
};

export default ControlPanel;