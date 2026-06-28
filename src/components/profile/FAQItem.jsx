import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const FAQItem = ({ question }) => (
  <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800">
    <Text className="text-gray-700 dark:text-gray-300 font-medium flex-1 mr-4">{question}</Text>
    <Feather name="chevron-down" size={20} color={COLORS.textSubtle} />
  </TouchableOpacity>
);

export default FAQItem;