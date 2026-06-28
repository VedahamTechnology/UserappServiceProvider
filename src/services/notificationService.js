import { api } from './api/client';
import { ENDPOINTS, buildQuery } from './api/endpoints';

export const notificationService = {
  getNotifications: (params = {}) =>
    api.get(ENDPOINTS.notifications(), { query: buildQuery(params) }),

  getUnreadCount: () => api.get(ENDPOINTS.unreadCount()),

  getNotificationsByType: (type, params = {}) =>
    api.get(ENDPOINTS.notificationsByType(type), { query: buildQuery(params) }),

  getPreferences: () => api.get(ENDPOINTS.notificationPreferences()),

  markAsRead: (notificationId) => api.put(ENDPOINTS.markNotificationRead(notificationId), {}),

  markAllAsRead: () => api.put(ENDPOINTS.markAllNotificationsRead(), {}),

  deleteNotification: (notificationId) => api.delete(ENDPOINTS.deleteNotification(notificationId)),

  clearAllNotifications: () => api.delete(ENDPOINTS.clearAllNotifications()),
};
