
import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <header className="bg-brand-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            <span className="text-brand-accent-end">AI</span> {t('appTitle')}
          </h1>
          <p className="text-xs text-brand-subtle -mt-1">{t('appDesigner')}</p>
        </div>
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-brand-surface hover:bg-brand-muted rounded-md text-sm font-medium transition-colors"
        >
          {language === 'en' ? 'Tiếng Việt' : 'English'}
        </button>
      </div>
    </header>
  );
};

export default Header;