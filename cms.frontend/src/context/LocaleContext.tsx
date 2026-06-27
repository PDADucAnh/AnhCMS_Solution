import React, { createContext, useState, useContext, useEffect, useCallback, type ReactNode } from 'react';

type Locale = 'en' | 'vi';
type Currency = 'usd' | 'vnd';

interface LocaleState {
  locale: Locale;
  currency: Currency;
}

interface LocaleContextType extends LocaleState {
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;
  setPreference: (locale: Locale, currency: Currency) => void;
}

const STORAGE_KEY = 'locale_pref';

const getInitial = (): LocaleState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        locale: parsed.locale === 'vi' ? 'vi' : 'en',
        currency: parsed.currency === 'vnd' ? 'vnd' : 'usd',
      };
    }
  } catch {}
  return { locale: 'en', currency: 'usd' };
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LocaleState>(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setLocale = useCallback((locale: Locale) => {
    setState(prev => ({ ...prev, locale }));
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    setState(prev => ({ ...prev, currency }));
  }, []);

  const setPreference = useCallback((locale: Locale, currency: Currency) => {
    setState({ locale, currency });
  }, []);

  return (
    <LocaleContext.Provider value={{ ...state, setLocale, setCurrency, setPreference }}>
      {children}
    </LocaleContext.Provider>
  );
};
