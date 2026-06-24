import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';

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
}) => {
  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center border-b py-3 ${
          isFocused ? 'border-primaryColor' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
      >
        {icon && (
          <Feather
            name={icon}
            size={22}
            color={isFocused ? primaryColor : '#9CA3AF'}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor={isFocused ? primaryColor : '#9CA3AF'}
          className="flex-1 ml-3 text-lg dark:text-white"
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity onPress={onPasswordToggle}>
            <Feather
              name={secureTextEntry ? 'eye' : 'eye-off'}
              size={22}
              color={isFocused ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
    </View>
  );
};

export default Input;
