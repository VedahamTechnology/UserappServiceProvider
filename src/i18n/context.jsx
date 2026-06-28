import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import { storage } from '../services/storageService';
import { DEFAULT_LOCALE, getDict, isSupportedLocale } from './index';

/**
 * I18nContext — exposes the current locale, the dictionary, and a
 * `setLocale` action that persists to secure storage.
 */
export const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  dict: getDict(DEFAULT_LOCALE),
  setLocale: async () => {},
});

export const I18nProvider = ({ children }) => {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await storage.getLocale();
        if (!cancelled && isSupportedLocale(saved)) {
          setLocaleState(saved);
        }
      } catch {
        // ignore — keep default
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const setLocale = useCallback(async (next) => {
    if (!isSupportedLocale(next)) return;
    setLocaleState(next);
    try { await storage.saveLocale(next); } catch {}
  }, []);

  const value = useMemo(() => ({
    locale,
    dict: getDict(locale),
    setLocale,
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};