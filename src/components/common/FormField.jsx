import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/radii';

/**
 * Labeled text input used in modals and forms.
 */
const FormField = ({ label, value, onChangeText, placeholder, ...inputProps }) => (
  <View className="mb-3">
    {label ? (
      <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
    ) : null}
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.placeholder}
      className={`bg-gray-50 dark:bg-slate-800 px-4 py-3 ${RADIUS.lg} text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700`}
      {...inputProps}
    />
  </View>
);

export default FormField;