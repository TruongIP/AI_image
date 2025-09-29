import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Language, Translations } from '../types';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, viResponse] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/vi.json'),
        ]);
        if (!enResponse.ok || !viResponse.ok) {
          throw new Error('Network response was not ok for translations');
        }
        const en = await enResponse.json();
        const vi = await viResponse.json();
        setTranslations({ en, vi });
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty translations to allow app to render
        setTranslations({ en: {}, vi: {} });
      }
    };

    fetchTranslations();
  }, []);

  const t = (key: string): string => {
    return translations?.[language]?.[key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {translations ? children : null}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
