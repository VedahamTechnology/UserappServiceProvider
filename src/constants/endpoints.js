/**
 * API endpoint builders — single place to change a path.
 * Import the relevant helper rather than building paths inline in services.
 */

export const BASE_URL = 'https://admin-backend-01pa.onrender.com';

const API = '/api';

export const ENDPOINTS = {
  // Auth
  authLogin: () => `${API}/auth/login`,
  authRegister: () => `${API}/auth/register/customer`,
  authMe: () => `${API}/auth/me`,
  authLogout: () => `${API}/auth/logout`,

  // Categories
  categories: () => `${API}/vendor/services/browse/categories`,

  // Services
  services: () => `${API}/user/services`,
  servicesByCategory: (id) => `${API}/user/services/category/${id}`,
  serviceDetail: (id) => `${API}/user/services/${id}`,

  // Bookings
  bookings: () => `${API}/user/bookings`,
  cancelBooking: (id) => `${API}/user/bookings/${id}/cancel`,
  rescheduleBooking: (id) => `${API}/user/bookings/${id}/reschedule`,

  // Addresses
  addresses: () => `${API}/user/addresses`,
  updateAddress: (id) => `${API}/user/addresses/${id}`,
  setDefaultAddress: (id) => `${API}/user/addresses/${id}/default`,

  // Profile
  updateProfile: () => `${API}/user/profile`,

  // Payments
  createOrder: () => `${API}/payments/create-order`,
  verifyPayment: () => `${API}/payments/verify-payment`,

  // Notifications
  notifications: () => `${API}/notifications`,
  unreadCount: () => `${API}/notifications/unread/count`,
  notificationsByType: (type) => `${API}/notifications/type/${type}`,
  notificationPreferences: () => `${API}/notifications/preferences`,
  markNotificationRead: (id) => `${API}/notifications/${id}/read`,
  markAllNotificationsRead: () => `${API}/notifications/read/all`,
  deleteNotification: (id) => `${API}/notifications/${id}`,
  clearAllNotifications: () => `${API}/notifications`,
};

export const buildQuery = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.append(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
};
