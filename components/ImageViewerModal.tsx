
import React, { useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface ImageViewerModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ imageUrl, onClose }) => {
  const { t } = useLocalization();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

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

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="relative bg-brand-surface p-4 rounded-lg shadow-2xl max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt="Generated Portrait" className="max-w-full max-h-[80vh] object-contain rounded-md" />
        <div className="mt-4 flex justify-center gap-4">
          <a
            href={imageUrl}
            download={`ai-portrait-${Date.now()}.png`}
            className="px-6 py-2 bg-gradient-to-r from-brand-accent-start to-brand-accent-end hover:opacity-90 text-white font-bold rounded-lg transition-opacity"
          >
            Download
          </a>
          <button
            onClick={() => handleShare(imageUrl)}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors"
          >
            {t('shareButton')}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-muted hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;