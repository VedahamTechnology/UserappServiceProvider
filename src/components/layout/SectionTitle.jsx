import React from 'react';
import { Text } from 'react-native';

const SectionTitle = ({ children, className = '' }) => (
  <Text className={`text-xl font-bold text-gray-900 dark:text-white ${className}`}>
    {children}
  </Text>
);

export default SectionTitle;