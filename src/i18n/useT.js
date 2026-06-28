import { useContext, useMemo, useCallback } from 'react';
import { I18nContext } from './context';

/**
 * t(key, vars?) — translate a dotted key, with optional {placeholders}.
 *
 * Falls back to:
 *   - the key itself when missing in the dictionary
 *   - `{key}` placeholders if `vars` is missing a substitution
 */
export const useT = () => {
  const { dict } = useContext(I18nContext);

  const t = useCallback((key, vars) => {
    const value = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
    if (typeof value !== 'string') return key;
    if (!vars) return value;
    return Object.entries(vars).reduce(
      (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
      value,
    );
  }, [dict]);

  return useMemo(() => t, [t]);
};

/** Convenience: also expose locale + setLocale from the provider. */
export const useLocale = () => {
  const { locale, setLocale } = useContext(I18nContext);
  return { locale, setLocale };
};