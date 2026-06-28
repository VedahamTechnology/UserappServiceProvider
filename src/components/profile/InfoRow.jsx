import React from 'react';
import { View, Text } from 'react-native';

/**
 * Static label/value row used in EditProfile + AboutApp.
 */
const InfoRow = ({ label, value, isLast = false }) => (
  <View className={`flex-row justify-between py-4 ${!isLast ? 'border-b border-gray-100 dark:border-slate-800' : ''}`}>
    <Text className="text-gray-500 dark:text-gray-400 font-medium">{label}</Text>
    <Text className="text-gray-900 dark:text-gray-200 font-bold" numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export default InfoRow;