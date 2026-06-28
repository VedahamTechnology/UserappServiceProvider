import * as SecureStore from 'expo-secure-store';

/**
 * Centralized SecureStore keys. Avoid magic strings scattered across the app.
 */
export const STORAGE_KEYS = {
  token: 'accessToken',
  user: 'userData',
  locale: 'app.locale',
  theme: 'app.theme',
};

const safeSet = async (key, value) => {
  try { await SecureStore.setItemAsync(key, value); }
  catch (e) { console.error(`[storage] failed to set ${key}`, e); }
};

const safeGet = async (key) => {
  try { return await SecureStore.getItemAsync(key); }
  catch (e) {
    console.error(`[storage] failed to get ${key}`, e);
    return null;
  }
};

const safeDelete = async (key) => {
  try { await SecureStore.deleteItemAsync(key); }
  catch (e) { console.error(`[storage] failed to delete ${key}`, e); }
};

export const storage = {
  saveToken: (token) => safeSet(STORAGE_KEYS.token, token),
  getToken: () => safeGet(STORAGE_KEYS.token),

  saveUser: (user) => safeSet(STORAGE_KEYS.user, JSON.stringify(user)),
  getUser: async () => {
    const raw = await safeGet(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  },

  saveLocale: (locale) => safeSet(STORAGE_KEYS.locale, locale),
  getLocale: () => safeGet(STORAGE_KEYS.locale),

  saveTheme: (theme) => safeSet(STORAGE_KEYS.theme, theme),
  getTheme: () => safeGet(STORAGE_KEYS.theme),

  clearAll: async () => {
    await Promise.all([
      safeDelete(STORAGE_KEYS.token),
      safeDelete(STORAGE_KEYS.user),
    ]);
  },
};
