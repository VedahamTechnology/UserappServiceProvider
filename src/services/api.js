import { storage } from './storageService';

const BASE_URL = 'https://admin-backend-01pa.onrender.com'; 

const getHeaders = async () => {
  const token = await storage.getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: await getHeaders(),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(result.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.body = result;
      throw err;
    }
    return result;
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(result.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.body = result;
      throw err;
    }

    return result;
  },

  put: async (endpoint, data = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(result.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.body = result;
      throw err;
    }
    return result;
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(result.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.body = result;
      throw err;
    }
    return result;
  },
};