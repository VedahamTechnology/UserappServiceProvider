import en from './locales/en.json';
import hi from './locales/hi.json';

/**
 * Locale registry. Adding a new language = drop a JSON file + add a row here.
 */
export const LOCALES = {
  en: { label: 'English', native: 'English', dict: en },
  hi: { label: 'Hindi', native: 'हिन्दी', dict: hi },
};

export const DEFAULT_LOCALE = 'en';

export const isSupportedLocale = (l) => Object.prototype.hasOwnProperty.call(LOCALES, l);

export const getDict = (locale) =>
  (LOCALES[locale] || LOCALES[DEFAULT_LOCALE]).dict;

export const getLocaleOptions = () =>
  Object.entries(LOCALES).map(([code, meta]) => ({ code, ...meta }));