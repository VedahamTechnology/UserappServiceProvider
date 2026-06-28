import React from 'react';
import { View } from 'react-native';

/**
 * Generic surface for grouping profile/settings list rows.
 */
const SectionCard = ({ children, className = 'mx-4 px-4' }) => (
  <View className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm ${className}`}>
    {children}
  </View>
);

export default SectionCard;