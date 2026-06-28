import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { ApiError } from '../../utils/errors';
import { formatDateKey, isTodayKey } from '../../utils/date';
import { useT } from '../../i18n/useT';
import { useToast } from '../../context/ToastContext';
import { bookingService } from '../../services/bookingService';

import BottomSheetModal from '../common/BottomSheetModal';
import DateStrip from './DateStrip';
import TimeSlotPicker from './TimeSlotPicker';
import { TIME_SLOTS } from '../../constants/timeSlots';

const ACTIVE_STATUSES = ['pending', 'confirmed', 'accepted'];

/**
 * Reschedule + Cancel actions shown on a booking card.
 * Hidden when booking isn't in an active state.
 */
const BookingActions = ({ booking, onUpdated }) => {
  const t = useT();
  const toast = useToast();

  const status = (booking?.status || '').toLowerCase();
  const isActive = ACTIVE_STATUSES.includes(status);

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState(formatDateKey(new Date()));
  const [rescheduleSlot, setRescheduleSlot] = useState(TIME_SLOTS[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const isToday = booking?.date ? isTodayKey(booking.date) : false;

  if (!isActive) return null;

  const handleCancelPress = () => {
    setCancelReason('');
    setCancelOpen(true);
  };

  const handleReschedulePress = () => {
    if (isToday) {
      Alert.alert(
        t('bookings.errRescheduleTooLate'),
        t('bookings.errRescheduleToday'),
      );
      return;
    }
    setRescheduleDate(formatDateKey(new Date()));
    setRescheduleSlot(TIME_SLOTS[0]);
    setRescheduleReason('');
    setRescheduleOpen(true);
  };

  const submitCancel = async () => {
    setBusy(true);
    try {
      const response = await bookingService.cancelBooking(booking.id, cancelReason.trim());
      if (response.success) {
        setCancelOpen(false);
        toast.show(t('bookings.cancelled'), 'success');
        onUpdated && onUpdated();
      } else {
        toast.show(response.message || response.error || t('bookings.errCancelFailed'), 'error');
      }
    } catch (error) {
      toast.show(error.message || t('bookings.errCancelFailed'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitReschedule = async () => {
    setBusy(true);
    try {
      const response = await bookingService.rescheduleBooking(booking.id, {
        bookingDate: rescheduleDate,
        timeSlot: rescheduleSlot,
        reason: rescheduleReason.trim() || '',
      });
      if (response.success) {
        setRescheduleOpen(false);
        toast.show(t('bookings.rescheduled'), 'success');
        onUpdated && onUpdated();
      } else {
        const hint = t('bookings.rescheduleHint');
        toast.show(`${response.message || response.error || t('bookings.errRescheduleFailed')}\n\n${hint}`, 'error');
      }
    } catch (error) {
      const isClientError = error instanceof ApiError && error.isClientError();
      const hint = isClientError ? `\n\n${t('bookings.rescheduleHint')}` : '';
      toast.show(`${error.message || t('bookings.errRescheduleFailed')}${hint}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <View className="flex-row mt-6 space-x-3">
        <TouchableOpacity
          onPress={handleReschedulePress}
          disabled={busy || isToday}
          className={`flex-1 py-3 rounded-2xl items-center mx-3 ${
            isToday ? 'bg-gray-100 dark:bg-slate-800' : 'bg-primary/10'
          }`}
        >
          <Text className={`font-bold ${isToday ? 'text-gray-400 dark:text-gray-500' : 'text-primary'}`}>
            {t('bookings.reschedule')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelPress}
          disabled={busy}
          className="flex-1 bg-gray-100 dark:bg-slate-700 py-3 rounded-2xl items-center"
        >
          <Text className="text-gray-600 dark:text-gray-300 font-bold">
            {t('bookings.cancel')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cancel modal */}
      <BottomSheetModal
        visible={cancelOpen}
        onClose={() => !busy && setCancelOpen(false)}
        title={t('bookings.cancelTitle')}
      >
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t('bookings.cancelPrompt')}
        </Text>
        <TextInput
          placeholder={t('bookings.cancelPlaceholder')}
          placeholderTextColor={COLORS.placeholder}
          value={cancelReason}
          onChangeText={setCancelReason}
          multiline
          numberOfLines={3}
          className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 mb-5"
          style={{ textAlignVertical: 'top' }}
        />
        <TouchableOpacity
          onPress={submitCancel}
          disabled={busy}
          className={`py-4 rounded-2xl items-center ${busy ? 'bg-gray-300' : 'bg-danger'}`}
        >
          {busy ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              {t('bookings.confirmCancellation')}
            </Text>
          )}
        </TouchableOpacity>
      </BottomSheetModal>

      {/* Reschedule modal */}
      <BottomSheetModal
        visible={rescheduleOpen}
        onClose={() => !busy && setRescheduleOpen(false)}
        title={t('bookings.rescheduleTitle')}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {t('bookings.newDate')}
          </Text>
          <View className="mb-5">
            <DateStrip value={rescheduleDate} onChange={setRescheduleDate} />
          </View>

          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {t('bookings.newTimeSlot')}
          </Text>
          <View className="mb-5">
            <TimeSlotPicker value={rescheduleSlot} onChange={setRescheduleSlot} />
          </View>

          <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {t('bookings.reasonOptional')}
          </Text>
          <TextInput
            placeholder={t('bookings.cancelPlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            value={rescheduleReason}
            onChangeText={setRescheduleReason}
            multiline
            numberOfLines={2}
            className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 mb-5"
            style={{ textAlignVertical: 'top' }}
          />

          <TouchableOpacity
            onPress={submitReschedule}
            disabled={busy}
            className={`py-4 rounded-2xl items-center ${busy ? 'bg-gray-300' : 'bg-primary'}`}
          >
            {busy ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                {t('bookings.confirmReschedule')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </BottomSheetModal>
    </>
  );
};

export default BookingActions;
