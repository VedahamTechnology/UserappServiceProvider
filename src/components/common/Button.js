import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({ onPress, title, loading, className = '', textClassName = '' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`bg-primaryColor py-4 rounded-xl items-center active:opacity-70 ${className} ${loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`text-white font-semibold text-base ${textClassName}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
