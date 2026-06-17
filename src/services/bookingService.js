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
};
