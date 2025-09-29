
import React from 'react';
import type { VideoOptions } from '../types';
import ImageUploader from './ImageUploader';
import { useLocalization } from '../context/LocalizationContext';

interface VideoControlPanelProps {
  options: VideoOptions;
  setOptions: React.Dispatch<React.SetStateAction<VideoOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const VideoControlPanel: React.FC<VideoControlPanelProps> = ({ options, setOptions, onGenerate, isLoading }) => {
  const { t } = useLocalization();

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg space-y-8 sticky top-24">
      <div>
        <h3 className="font-semibold mb-2">{t('videoPromptTitle')}</h3>
        <textarea
          placeholder={t('videoPromptPlaceholder')}
          value={options.prompt}
          onChange={(e) => setOptions(prev => ({ ...prev, prompt: e.target.value }))}
          rows={5}
          className="w-full bg-slate-800 border border-brand-muted rounded-md p-2 text-sm focus:ring-2 focus:ring-brand-accent-end focus:border-brand-accent-end transition"
        />
      </div>

      <ImageUploader
        title={t('videoImageTitle')}
        description={t('videoImageDesc')}
        files={options.sourceImage ? [options.sourceImage] : []}
        onFilesChange={(files) => setOptions(prev => ({ ...prev, sourceImage: files[0] || null }))}
        maxFiles={1}
      />
      
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
          t('generateVideoButton')
        )}
      </button>

    </div>
  );
};

export default VideoControlPanel;