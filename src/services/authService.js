import { api } from './api';

export const login = async (email, password, rememberMe) => {
  return api.post('/login', {
    email,
    password,
    role: "user"
  });
};

export const register = async (userData) => {
  return api.post('/register', userData);
};