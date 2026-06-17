import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'userData';

export const storage = {
  saveToken: async (token) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (e) {
      console.error('Error saving token', e);
    }
  },

  getToken: async () => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.error('Error getting token', e);
      return null;
    }
  },

  saveUser: async (user) => {
    try {
      // SecureStore has a 2048 byte limit. 
      // If user data is too large, this might fail.
      const userStr = JSON.stringify(user);
      await SecureStore.setItemAsync(USER_KEY, userStr);
    } catch (e) {
      console.error('Error saving user data', e);
    }
  },

  getUser: async () => {
    try {
      const user = await SecureStore.getItemAsync(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error getting user data', e);
      return null;
    }
  },

  clearAll: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  }
};
