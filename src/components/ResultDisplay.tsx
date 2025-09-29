
import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import Loader from './Loader';
import ImageViewerModal from './ImageViewerModal';
import { useLocalization } from '../context/LocalizationContext';

interface ResultDisplayProps {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

const ViewIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ShareIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  images, 
  isLoading, 
  error
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLocalization();

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadAll = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const link = document.createElement('a');
      link.href = image.src;
      // Using a more specific name for downloaded files
      link.download = `ai-portrait-${i + 1}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Add a small delay to prevent the browser from blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };
  
  const dataURLtoFile = async (dataurl: string, filename: string): Promise<File | null> => {
    try {
        const res = await fetch(dataurl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error('Error converting data URL to File:', error);
        return null;
    }
  };

  const handleShare = async (imageUrl: string) => {
    const file = await dataURLtoFile(imageUrl, `ai-portrait-${Date.now()}.png`);
    if (!file) {
        alert(t('shareErrorGeneric'));
        return;
    }

    const shareData = {
        title: t('shareTitle'),
        text: t('shareText'),
        files: [file],
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error('Sharing failed:', error);
                alert(t('shareErrorFailed'));
            }
        }
    } else {
        alert(t('shareNotSupported'));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader message={t('generating')} />;
    }
    if (error) {
      return <div className="text-center text-red-400">{t('genericError')}: {error}</div>;
    }
    if (images.length === 0) {
      return (
        <div className="text-center text-brand-subtle">
          <h2 className="text-2xl font-semibold mb-4">{t('resultsTitle')}</h2>
          <p>{t('resultsEmpty')}</p>
        </div>
      );
    }
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t('resultsTitle')}</h2>
          {images.length > 0 && !isLoading && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 bg-gradient-to-r from-brand-accent-start to-brand-accent-end hover:opacity-90 text-white font-bold rounded-lg transition-opacity text-sm"
            >
              {t('downloadAllButton')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-brand-surface rounded-lg overflow-hidden shadow-lg flex flex-col">
              <div className="relative group">
                <img src={img.src} alt={img.alt} className="aspect-square w-full object-cover transition-transform duration-300 lg:group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 lg:group-hover:bg-black/50 transition-all hidden lg:flex items-center justify-center opacity-0 lg:group-hover:opacity-100">
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => setSelectedImage(img.src)}
                      className="flex flex-col items-center text-white font-bold p-2 rounded-lg hover:bg-white/10 transition-colors"
                      aria-label="View larger"
                    >
                      <ViewIcon className="w-8 h-8"/>
                      <span className="text-xs mt-1">View</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleShare(img.src); }}
                      className="flex flex-col items-center text-white font-bold p-2 rounded-lg hover:bg-white/10 transition-colors"
                      aria-label="Share image"
                    >
                      <ShareIcon className="w-8 h-8"/>
                      <span className="text-xs mt-1">{t('shareButton')}</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile-only action bar */}
              <div className="flex lg:hidden justify-around items-center p-2">
                 <button
                    onClick={() => setSelectedImage(img.src)}
                    className="flex items-center gap-2 text-brand-subtle font-semibold p-2 rounded-lg hover:bg-brand-muted/50 transition-colors text-sm"
                    aria-label="View larger"
                  >
                    <ViewIcon className="w-5 h-5"/>
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleShare(img.src); }}
                    className="flex items-center gap-2 text-brand-subtle font-semibold p-2 rounded-lg hover:bg-brand-muted/50 transition-colors text-sm"
                    aria-label="Share image"
                  >
                    <ShareIcon className="w-5 h-5"/>
                    <span>{t('shareButton')}</span>
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg min-h-[80vh] flex items-center justify-center">
      {renderContent()}
      {selectedImage && <ImageViewerModal imageUrl={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default ResultDisplay;