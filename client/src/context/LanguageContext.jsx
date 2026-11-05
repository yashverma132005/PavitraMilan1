import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const translations = { en, hi };
const STORAGE_KEY = 'pavitramilan_lang';

const LanguageContext = createContext();

/**
 * Resolve a dot-notation key (e.g. "nav.dashboard") from a translations object.
 */
function resolve(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? path;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') return stored;
    } catch {
      // ignore
    }
    return 'en';
  });

  // Persist to localStorage and update <html lang="">
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'hi') setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  /**
   * Translate a key. Example: t('nav.dashboard') → "Dashboard" or "डैशबोर्ड"
   */
  const t = useCallback(
    (key) => resolve(translations[language], key),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
