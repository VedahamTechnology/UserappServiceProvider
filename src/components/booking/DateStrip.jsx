import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { nextDateKeys, weekdayName } from '../../utils/date';
import { DATE_PICKER_DAYS } from '../../constants/timeSlots';
import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/radii';

/**
 * Horizontal date selector used in CheckoutScreen + reschedule modal.
 *
 * <DateStrip value={date} onChange={setDate} />
 */
const DateStrip = ({ value, onChange, count = DATE_PICKER_DAYS }) => {
  const t = useT();
  const dates = useMemo(() => nextDateKeys(count), [count]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {dates.map((dateKey) => {
        const d = new Date(dateKey);
        const dayName = weekdayName(dateKey, t);
        const dayNum = d.getDate();
        const active = value === dateKey;
        return (
          <TouchableOpacity
            key={dateKey}
            onPress={() => onChange(dateKey)}
            className={`w-16 h-20 ${RADIUS.lg} items-center justify-center mr-3 border ${
              active
                ? 'bg-primary border-primary'
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
  );
};

export default DateStrip;