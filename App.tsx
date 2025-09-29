
import React, { useState, useCallback } from 'react';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import { generatePortraits } from './services/geminiService';
import type { PortraitOptions, GeneratedImage } from './types';
import { STYLES, SHOTS, ASPECT_RATIOS, QUALITIES } from './constants';


const HeroSection: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
        {t('heroTitle')}
      </h1>
      <p className="max-w-3xl mx-auto text-lg text-brand-subtle">
        {t('heroSubtitle')}
      </p>
    </div>
  );
};

const App: React.FC = () => {
  // Portrait State
  const [portraitOptions, setPortraitOptions] = useState<PortraitOptions>({
    sourceImages: [],
    style: STYLES[0].id,
    shot: SHOTS[0].id,
    aspectRatio: ASPECT_RATIOS[0].id,
    outfitDescription: '',
    outfitImage: null,
    quality: QUALITIES[0].id,
    refinePrompt: '',
    hairstyleImage: null,
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isPortraitLoading, setIsPortraitLoading] = useState<boolean>(false);
  const [portraitError, setPortraitError] = useState<string | null>(null);

  const handleGeneratePortraits = useCallback(async () => {
    if (portraitOptions.sourceImages.length === 0) {
      setPortraitError('Please upload at least one source image.');
      return;
    }
    setIsPortraitLoading(true);
    setPortraitError(null);
    setGeneratedImages([]);

    try {
      const results = await generatePortraits(portraitOptions);
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setPortraitError('Failed to generate portraits. Please check the console for more details.');
    } finally {
      setIsPortraitLoading(false);
    }
  }, [portraitOptions]);
  
  return (
    <LocalizationProvider>
      <div className="min-h-screen bg-brand-bg font-sans">
        <Header />
        <main className="container mx-auto p-4 lg:p-8">
          <HeroSection />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <ControlPanel options={portraitOptions} setOptions={setPortraitOptions} onGenerate={handleGeneratePortraits} isLoading={isPortraitLoading} generated={generatedImages.length > 0} />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <ResultDisplay 
                images={generatedImages} 
                isLoading={isPortraitLoading} 
                error={portraitError}
              />
            </div>
          </div>
        </main>
      </div>
    </LocalizationProvider>
  );
};

export default App;