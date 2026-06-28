import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useBookings } from '../context/BookingsContext';
import { useToast } from '../context/ToastContext';
import { useT } from '../i18n/useT';
import { COLORS } from '../constants/colors';
import { extractList, mapBooking } from '../utils/mappers';
import { useFocusRefresh } from '../hooks/useFocusRefresh';

import BookingCard from '../components/booking/BookingCard';
import LoadingView from '../components/feedback/LoadingView';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';

import { bookingService } from '../services/bookingService';

const TABS = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

/**
 * Bookings tab. Fetches per-tab on tab change so the badge copy stays
 * accurate even when the global BookingsContext is filtered to a different
 * status. Re-fetches when the screen regains focus.
 */
export default function BookingsScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const { refresh: refreshAll } = useBookings();

  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await bookingService.getUserBookings({
        status: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
      });
      if (response?.success) {
        setBookings(extractList(response, 'bookings', 'data').map(mapBooking));
      } else {
        setBookings([]);
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, t, toast]);

  useFocusRefresh(fetchBookings);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="bg-white dark:bg-slate-900">
        <View className="px-4 py-4">
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('bookings.title')}
          </Text>
        </View>

        {/* Scrollable Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 mb-4"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View className="flex-row bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={`tab-${tab}`}
                onPress={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl items-center ${
                  activeTab === tab ? 'bg-white dark:bg-slate-700' : ''
                }`}
              >
                <Text
                  className={`font-bold whitespace-nowrap ${
                    activeTab === tab ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {t(`bookings.tabs.${tab.toLowerCase()}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={fetchBookings} />
      ) : (
        <ScrollView
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchBookings(true)}
              colors={[COLORS.primary]}
            />
          }
        >
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onUpdated={() => {
                  fetchBookings();
                  refreshAll();
                }}
              />
            ))
          ) : (
            <EmptyState
              icon="calendar"
              title={t('bookings.noBookings')}
              subtitle={
                activeTab === 'All'
                  ? t('bookings.noBookingsHint')
                  : t('bookings.noBookingsForTab', { tab: activeTab })
              }
            />
          )}
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}