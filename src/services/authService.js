import { api } from './api/client';
import { ENDPOINTS } from './api/endpoints';
import { storage } from './storageService';

/**
 * Persist token + user from a successful auth response.
 * Used by both `login` and `register`.
 */
const persistAuth = async (response) => {
  if (response?.success && response.accessToken) {
    await storage.saveToken(response.accessToken);
    if (response.user) await storage.saveUser(response.user);
  }
  return response;
};

export const login = async (email, password) => {
  const response = await api.post(ENDPOINTS.authLogin(), {
    email,
    password,
    role: 'customer',
  });
  return persistAuth(response);
};

export const register = async (userData) => {
  const response = await api.post(ENDPOINTS.authRegister(), userData);
  return persistAuth(response);
};

export const getCurrentUser = async () => {
  const response = await api.get(ENDPOINTS.authMe());
  if (response?.success && response.user) {
    await storage.saveUser(response.user);
  }
  return response;
};

/**
 * Update the current user's profile. Email is immutable on the backend.
 * Pass only the mutable fields: { firstName, lastName, phone, gender }.
 * Persists the returned user so the rest of the app picks up the change.
 */
export const updateProfile = async (payload) => {
  const response = await api.put(ENDPOINTS.updateProfile(), payload);
  if (response?.success && response.user) {
    await storage.saveUser(response.user);
  }
  return response;
};

/**
 * Best-effort logout: try to notify the backend, then ALWAYS clear local
 * storage. We never want the user to be stuck logged-in because of a
 * network failure.
 */
export const logout = async () => {
  try {
    await api.post(ENDPOINTS.authLogout());
  } catch {
    // swallow — we'll still clear local state
  }
  await storage.clearAll();
};
