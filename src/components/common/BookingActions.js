import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';
import { bookingService } from '../../services/bookingService';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TIME_SLOTS = [
  { startTime: '09:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '13:00' },
  { startTime: '13:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '17:00' },
  { startTime: '17:00', endTime: '19:00' },
];

const Chip = ({ active, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full border mr-2 mb-2 ${
      active ? 'bg-primaryColor border-primaryColor' : 'border-gray-200 dark:border-slate-700'
    }`}
  >
    <Text className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function BookingActions({ booking, onUpdated }) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState(formatDateKey(new Date()));
  const [rescheduleSlot, setRescheduleSlot] = useState(TIME_SLOTS[0]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  const [cancelReason, setCancelReason] = useState('');

  const status = (booking?.status || '').toLowerCase();
  const isActive = status === 'pending' || status === 'confirmed' || status === 'accepted';

  // Heuristic: bookings scheduled for today are usually too close to their start
  // time to be reschedulable (the backend rejects these). Disable the button
  // rather than letting the user hit an error.
  const bookingDateKey = booking?.date ? formatDateKey(new Date(booking.date)) : null;
  const todayKey = formatDateKey(new Date());
  const isToday = bookingDateKey === todayKey;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return formatDateKey(d);
  });

  const handleCancelPress = () => {
    if (!isActive) {
      Alert.alert('Not Allowed', 'Only active bookings can be cancelled.');
      return;
    }
    setCancelReason('');
    setCancelOpen(true);
  };

  const handleReschedulePress = () => {
    if (!isActive) {
      Alert.alert('Not Allowed', 'Only active bookings can be rescheduled.');
      return;
    }
    if (isToday) {
      Alert.alert(
        'Too Late to Reschedule',
        'Bookings scheduled for today cannot be rescheduled. Please cancel and rebook.'
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
      console.log('[Cancel] → bookingId:', booking.id, 'reason:', cancelReason.trim());
      const response = await bookingService.cancelBooking(booking.id, cancelReason.trim());
      console.log('[Cancel] ← response:', JSON.stringify(response));
      if (response.success) {
        setCancelOpen(false);
        Alert.alert('Cancelled', 'Your booking has been cancelled.');
        onUpdated && onUpdated();
      } else {
        Alert.alert('Cancel Failed', response.message || response.error || 'Could not cancel booking');
      }
    } catch (error) {
      console.log('[Cancel] ← error:', error?.message);
      Alert.alert('Cancel Failed', error.message || 'Could not cancel booking');
    } finally {
      setBusy(false);
    }
  };

  const submitReschedule = async () => {
    setBusy(true);
    try {
      const payload = {
        bookingDate: rescheduleDate,
        timeSlot: rescheduleSlot,
        reason: rescheduleReason.trim() || '',
      };
      console.log('[Reschedule] → payload:', JSON.stringify(payload), 'bookingId:', booking.id);
      const response = await bookingService.rescheduleBooking(booking.id, payload);
      console.log('[Reschedule] ← response:', JSON.stringify(response));
      if (response.success) {
        setRescheduleOpen(false);
        Alert.alert('Rescheduled', 'Your booking has been rescheduled.');
        onUpdated && onUpdated();
      } else {
        Alert.alert(
          'Reschedule Failed',
          response.message || response.error || 'Could not reschedule booking'
        );
      }
    } catch (error) {
      console.log(
        '[Reschedule] ← HTTP',
        error?.status,
        'message:',
        error?.message,
        'body:',
        JSON.stringify(error?.body)
      );
      // Backend sometimes rejects reschedules for bookings that are too close to
      // their original date/time, or that aren't in a reschedulable state.
      const hint =
        error?.status === 400 || error?.status === 403
          ? '\n\nThis booking may not be eligible for rescheduling (too close to the scheduled time, or the professional has already started). Please cancel and rebook instead.'
          : '';
      Alert.alert('Reschedule Failed', `${error?.message || 'Could not reschedule booking'}${hint}`);
    } finally {
      setBusy(false);
    }
  };

  if (!isActive) return null;

  return (
    <>
      <View className="flex-row mt-6 space-x-3">
        <TouchableOpacity
          onPress={handleReschedulePress}
          disabled={busy || isToday}
          className={`flex-1 py-3 rounded-2xl items-center mx-3 ${
            isToday ? 'bg-gray-100 dark:bg-slate-800' : 'bg-primaryColor/10'
          }`}
        >
          <Text
            className={`font-bold ${isToday ? 'text-gray-400 dark:text-gray-500' : 'text-primaryColor'}`}
          >
            Reschedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelPress}
          disabled={busy}
          className="flex-1 bg-gray-100 dark:bg-slate-700 py-3 rounded-2xl items-center"
        >
          <Text className="text-gray-600 dark:text-gray-300 font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Cancel modal */}
      <Modal animationType="slide" transparent visible={cancelOpen} onRequestClose={() => setCancelOpen(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold dark:text-white">Cancel Booking</Text>
              <TouchableOpacity onPress={() => setCancelOpen(false)} disabled={busy}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please tell us why you're cancelling (optional).
            </Text>
            <TextInput
              placeholder="e.g. Change of plans"
              placeholderTextColor="#9CA3AF"
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
              className={`py-4 rounded-2xl items-center ${busy ? 'bg-gray-300' : 'bg-red-500'}`}
            >
              {busy ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Confirm Cancellation</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reschedule modal */}
      <Modal animationType="slide" transparent visible={rescheduleOpen} onRequestClose={() => setRescheduleOpen(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold dark:text-white">Reschedule Booking</Text>
              <TouchableOpacity onPress={() => setRescheduleOpen(false)} disabled={busy}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
                {dates.map((date) => {
                  const d = new Date(date);
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const active = rescheduleDate === date;
                  return (
                    <TouchableOpacity
                      key={date}
                      onPress={() => setRescheduleDate(date)}
                      className={`w-16 h-20 rounded-2xl items-center justify-center mr-3 border ${
                        active
                          ? 'bg-primaryColor border-primaryColor'
                          : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                      }`}
                    >
                      <Text className={`text-[10px] font-black uppercase ${active ? 'text-white/80' : 'text-gray-400'}`}>
                        {dayName}
                      </Text>
                      <Text className={`text-xl font-black mt-1 ${active ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {dayNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Time Slot</Text>
              <View className="flex-row flex-wrap mb-5">
                {TIME_SLOTS.map((slot, idx) => (
                  <Chip
                    key={`slot-${idx}`}
                    active={rescheduleSlot.startTime === slot.startTime}
                    label={`${slot.startTime} - ${slot.endTime}`}
                    onPress={() => setRescheduleSlot(slot)}
                  />
                ))}
              </View>

              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reason (optional)</Text>
              <TextInput
                placeholder="e.g. Family emergency"
                placeholderTextColor="#9CA3AF"
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
                className={`py-4 rounded-2xl items-center ${busy ? 'bg-gray-300' : 'bg-primaryColor'}`}
              >
                {busy ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">Confirm Reschedule</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}