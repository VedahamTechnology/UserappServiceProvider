import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'nativewind';

import { storage } from '../services/storageService';

/**
 * App-wide theme controller.
 *
 * Why this exists:
 *   NativeWind's `useColorScheme()` lets you toggle dark/light via
 *   `setColorScheme()`, but the choice lives only in memory — it resets to
 *   the OS preference on every cold start. This context:
 *     1. Reads a persisted preference from secure storage on mount.
 *     2. Hydrates NativeWind via `setColorScheme()` so the first paint is
 *        already correct (no light-then-dark flash).
 *     3. Persists every subsequent toggle so the choice survives restarts.
 *
 * Consumers should prefer `useTheme()` over NativeWind's `useColorScheme()`
 * directly so they react to the same stored value.
 */

const ThemeContext = createContext({
  colorScheme: 'light',
  isDark: false,
  setScheme: () => {},
  toggleScheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const { colorScheme: nativeScheme, setColorScheme } = useColorScheme();
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage exactly once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await storage.getTheme();
        if (!cancelled && (stored === 'light' || stored === 'dark')) {
          setColorScheme(stored);
        }
      } catch {
        // ignore — fall back to system / NativeWind default
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [setColorScheme]);

  const persistAndApply = useCallback(async (next) => {
    try {
      setColorScheme(next);
    } catch {
      // NativeWind throws if darkMode !== 'class' in tailwind.config.js.
      // Swallow — the user will still see the current theme applied.
    }
    try {
      await storage.saveTheme(next);
    } catch {
      // Storage failures should not crash the app.
    }
  }, [setColorScheme]);

  const setScheme = useCallback((next) => {
    if (next !== 'light' && next !== 'dark') return;
    persistAndApply(next);
  }, [persistAndApply]);

  const toggleScheme = useCallback(() => {
    const next = nativeScheme === 'dark' ? 'light' : 'dark';
    persistAndApply(next);
  }, [nativeScheme, persistAndApply]);

  const value = useMemo(() => ({
    colorScheme: nativeScheme || 'light',
    isDark: nativeScheme === 'dark',
    hydrated,
    setScheme,
    toggleScheme,
  }), [nativeScheme, hydrated, setScheme, toggleScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
