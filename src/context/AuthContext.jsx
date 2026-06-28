import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../services/authService';
import { storage } from '../services/storageService';
import { mapUser } from '../utils/mappers';

const AuthContext = createContext({
  user: null,
  isAuthed: false,
  initializing: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
  updateProfile: async () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Hydrate user from secure storage on boot.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cached = await storage.getUser();
        if (!cancelled && cached) setUserState(mapUser(cached));
      } catch {}
      if (!cancelled) setInitializing(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const setUser = useCallback((u) => setUserState(u ? mapUser(u) : null), []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    if (response?.success && response.user) setUserState(mapUser(response.user));
    return response;
  }, [setUser]);

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    if (response?.success && response.user) setUserState(mapUser(response.user));
    return response;
  }, [setUser]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response?.success && response.user) setUserState(mapUser(response.user));
    } catch {
      // Silently ignore — user stays as-is.
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const response = await authService.updateProfile(payload);
    if (response?.success && response.user) {
      setUserState(mapUser(response.user));
    }
    return response;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthed: !!user,
    initializing,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    setUser,
  }), [user, initializing, login, register, logout, refreshUser, updateProfile, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;