import { api } from './api';

export const bookingService = {
  getUserBookings: async (params = {}) => {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    let query = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (status && status !== 'All') {
      query += `&status=${status.toLowerCase()}`;
    }

    try {
      const response = await api.get(`/api/user/bookings${query}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/user/bookings', bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (bookingId, reason = '') => {
    try {
      const response = await api.put(`/api/user/bookings/${bookingId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  },

  rescheduleBooking: async (bookingId, { bookingDate, timeSlot, reason }) => {
    try {
      const response = await api.put(
        `/api/user/bookings/${bookingId}/reschedule`,
        { bookingDate, timeSlot, reason }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};