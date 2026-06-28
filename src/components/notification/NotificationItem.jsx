import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { formatRelative } from '../../utils/date';

const TYPE_ICONS = {
  booking_created: { name: 'calendar', color: COLORS.info, bg: COLORS.infoBg },
  booking_accepted: { name: 'calendar', color: COLORS.info, bg: COLORS.infoBg },
  booking_completed: { name: 'check-circle', color: COLORS.success, bg: COLORS.successBg },
  booking_cancelled: { name: 'x-circle', color: COLORS.danger, bg: COLORS.dangerBg },
  booking_rejected: { name: 'x-circle', color: COLORS.danger, bg: COLORS.dangerBg },
};
const DEFAULT_ICON = { name: 'bell', color: COLORS.primary, bg: '#FFE4E6' };

/**
 * One row in the notifications list.
 */
const NotificationItem = ({ item, onPress }) => {
  const iconData = TYPE_ICONS[item.type] || DEFAULT_ICON;
  const formattedDate = formatRelative(item.createdAt);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`p-4 mb-3 rounded-3xl flex-row items-center border ${
        item.isRead ? 'bg-white border-gray-100' : 'bg-primary/5 border-primary/10'
      }`}
      onPress={() => onPress && onPress(item)}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center"
        style={{ backgroundColor: iconData.bg }}
      >
        <Feather name={iconData.name} size={24} color={iconData.color} />
      </View>

      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-start">
          <Text className={`text-base flex-1 ${item.isRead ? 'font-bold text-gray-700' : 'font-black text-gray-900'}`}>
            {item.title}
          </Text>
          <Text className="text-[10px] text-gray-400 font-bold ml-2">{formattedDate}</Text>
        </View>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {!item.isRead ? <View className="ml-3 w-2 h-2 rounded-full bg-primary" /> : null}
    </TouchableOpacity>
  );
};

export default NotificationItem;
