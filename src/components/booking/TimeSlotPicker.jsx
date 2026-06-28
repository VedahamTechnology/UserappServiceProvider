import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TIME_SLOTS } from '../../constants/timeSlots';
import { RADIUS } from '../../constants/radii';
import { COLORS } from '../../constants/colors';

/**
 * Chip-grid picker for booking time slots.
 *
 * <TimeSlotPicker value={slot} onChange={setSlot} />
 */
const TimeSlotPicker = ({ value, onChange, slots = TIME_SLOTS }) => (
  <View className="flex-row flex-wrap">
    {slots.map((slot) => {
      const active = value?.startTime === slot.startTime;
      return (
        <TouchableOpacity
          key={slot.startTime}
          onPress={() => onChange(slot)}
          className={`px-4 py-3 ${RADIUS.lg} mr-2 mb-2 border ${
            active ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
          }`}
        >
          <Text className={`font-black text-sm ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
            {slot.startTime} - {slot.endTime}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default TimeSlotPicker;