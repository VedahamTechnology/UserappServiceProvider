import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { bookingService } from '../services/bookingService';
import { extractList, mapBooking } from '../utils/mappers';

const BookingsContext = createContext({
  bookings: [],
  loading: false,
  error: null,
  refresh: async () => {},
  cancel: async () => {},
  reschedule: async () => {},
  getByStatus: () => [],
});

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.getUserBookings({ status: 'All' });
      const list = extractList(response, 'bookings', 'data');
      setBookings(list.map(mapBooking));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id, reason = '') => {
    const response = await bookingService.cancelBooking(id, reason);
    await refresh();
    return response;
  }, [refresh]);

  const reschedule = useCallback(async (id, payload) => {
    const response = await bookingService.rescheduleBooking(id, payload);
    await refresh();
    return response;
  }, [refresh]);

  const getByStatus = useCallback((status) => {
    if (!status || status === 'All') return bookings;
    const wanted = status.toLowerCase();
    return bookings.filter((b) => b.status === wanted);
  }, [bookings]);

  const value = useMemo(() => ({
    bookings, loading, error, refresh, cancel, reschedule, getByStatus,
  }), [bookings, loading, error, refresh, cancel, reschedule, getByStatus]);

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
};

export const useBookings = () => useContext(BookingsContext);

export default BookingsContext;