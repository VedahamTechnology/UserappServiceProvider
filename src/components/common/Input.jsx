import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

/**
 * Underlined input with optional icon and password toggle.
 */
const Input = ({
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  showPasswordToggle,
  onPasswordToggle,
  isFocused,
  onFocus,
  onBlur,
  error,
  ...props
}) => (
  <View className="mb-4">
    <View
      className={`flex-row items-center border-b py-3 ${
        isFocused ? 'border-primary' : 'border-gray-300'
      } ${error ? 'border-danger' : ''}`}
    >
      {icon ? (
        <Feather
          name={icon}
          size={22}
          color={isFocused ? COLORS.primary : COLORS.textSubtle}
        />
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        className="flex-1 ml-3 text-lg dark:text-white"
        {...props}
      />
      {showPasswordToggle ? (
        <TouchableOpacity onPress={onPasswordToggle}>
          <Feather
            name={secureTextEntry ? 'eye' : 'eye-off'}
            size={22}
            color={COLORS.textSubtle}
          />
        </TouchableOpacity>
      ) : null}
    </View>
    {error ? <Text className="text-danger mt-1 text-sm">{error}</Text> : null}
  </View>
);

export default Input;