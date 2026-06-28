import React, { useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';

import { useBookings } from '../../context/BookingsContext';
import { useToast } from '../../context/ToastContext';
import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import BookingCard from '../../components/booking/BookingCard';
import LoadingView from '../../components/feedback/LoadingView';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';

export default function MyBookingScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const { bookings, loading, error, refresh } = useBookings();

  const onRefresh = useCallback(async () => {
    try {
      await refresh();
    } catch (e) {
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    }
  }, [refresh, toast, t]);

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('myBooking.title')} onBack={() => navigation.goBack()} />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={onRefresh} />
      ) : (
        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        >
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onUpdated={refresh} />
            ))
          ) : (
            <EmptyState
              icon="calendar"
              title={t('bookings.noBookings')}
              subtitle={t('bookings.noBookingsHint')}
            />
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}