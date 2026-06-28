import { api } from './api/client';
import { ENDPOINTS, buildQuery } from './api/endpoints';

export const bookingService = {
  getUserBookings: ({ status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = {}) => {
    const params = { page, limit, sortBy, sortOrder };
    if (status && status !== 'All') params.status = String(status).toLowerCase();
    return api.get(ENDPOINTS.bookings(), { query: buildQuery(params) });
  },

  createBooking: (bookingData) => api.post(ENDPOINTS.bookings(), bookingData),

  cancelBooking: (bookingId, reason = '') =>
    api.put(ENDPOINTS.cancelBooking(bookingId), { reason }),

  rescheduleBooking: (bookingId, { bookingDate, timeSlot, reason }) =>
    api.put(ENDPOINTS.rescheduleBooking(bookingId), { bookingDate, timeSlot, reason }),
};
