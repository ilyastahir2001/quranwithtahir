
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../translations';

interface I18nContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: (key: keyof typeof TRANSLATIONS.EN) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('qwt_lang');
    if (saved) return saved as AppLanguage;
    
    // Auto-detection based on browser
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (['EN', 'AR', 'UR', 'FR'].includes(browserLang)) return browserLang as AppLanguage;
    return 'EN';
  });

  const setLang = (newLang: AppLanguage) => {
    setLangState(newLang);
    localStorage.setItem('qwt_lang', newLang);
  };

  const t = (key: keyof typeof TRANSLATIONS.EN): string => {
    return (TRANSLATIONS[lang] as any)[key] || (TRANSLATIONS.EN as any)[key] || key;
  };

  const isRTL = TRANSLATIONS[lang].DIR === 'rtl';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang.toLowerCase();
  }, [lang, isRTL]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
