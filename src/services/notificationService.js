import { api } from './api';

export const notificationService = {
  getNotifications: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/api/notifications${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/notifications/unread/count');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getNotificationsByType: async (type, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/api/notifications/type/${type}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPreferences: async () => {
    try {
      const response = await api.get('/api/notifications/preferences');
      return response;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      // Endpoint is PUT /api/notifications/:notificationId/read
      // api.put isn't in api.js, let's check api.js content again
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/api/notifications/read/all');
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/api/notifications');
      return response;
    } catch (error) {
      throw error;
    }
  },
};
