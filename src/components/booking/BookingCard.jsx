import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { formatINR } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/date';
import StatusBadge from './StatusBadge';
import BookingActions from './BookingActions';
import { useT } from '../../i18n/useT';

/**
 * One row in the bookings list.
 *
 * <BookingCard booking={b} onUpdated={refresh} />
 */
const BookingCard = ({ booking, onUpdated }) => {
  const t = useT();
  const { id, serviceName, date, status, price, providerName } = booking;

  return (
    <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 border border-gray-100 dark:border-slate-700">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{serviceName}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {t('bookings.bookingId', { id: (id || '').slice(-6).toUpperCase() })}
          </Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <View className="flex-row items-center mt-6 pt-4 border-t border-gray-50 dark:border-slate-700">
        <View className="flex-1">
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">
            {t('bookings.dateTime')}
          </Text>
          <View className="flex-row items-center mt-1">
            <Feather name="calendar" size={14} color={COLORS.primary} />
            <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold text-sm">
              {date ? formatDisplayDate(date, { withTime: true }) : 'N/A'}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">
            {t('bookings.amountPaid')}
          </Text>
          <Text className="text-primary font-extrabold text-lg mt-1">{formatINR(price)}</Text>
        </View>
      </View>

      <BookingActions booking={booking} onUpdated={onUpdated} />
    </TouchableOpacity>
  );
};

export default BookingCard;
