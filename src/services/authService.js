import { api } from './api';
import { storage } from './storageService';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
      role: "customer"
    });
    
    if (response.success && response.accessToken) {
      await storage.saveToken(response.accessToken);
      await storage.saveUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register/customer', userData);
    
    if (response.success && response.accessToken) {
      await storage.saveToken(response.accessToken);
      await storage.saveUser(response.user);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    if (response.success && response.user) {
      await storage.saveUser(response.user);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    await storage.clearAll();
    return response;
  } catch (error) {
    // Even if API logout fails, we clear local storage
    await storage.clearAll();
    throw error;
  }
};