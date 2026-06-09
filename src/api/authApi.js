import apiClient from "./apiClient";

export const login = (data) =>
  apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerCustomer = (data) =>
  apiClient("/auth/register/customer", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMe = (token) =>
  apiClient("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const refreshToken = () =>
  apiClient("/auth/refresh", {
    method: "POST",
  });
