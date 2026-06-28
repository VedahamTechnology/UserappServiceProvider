import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const ErrorState = ({ message, onRetry }) => (
  <View className="flex-1 items-center justify-center py-20 px-10">
    <Feather name="alert-circle" size={32} color={COLORS.danger} />
    <Text className="text-gray-700 dark:text-gray-300 mt-3 text-center">{message}</Text>
    {onRetry ? (
      <TouchableOpacity onPress={onRetry} className="mt-4 bg-primary px-6 py-2 rounded-xl">
        <Text className="text-white font-bold">Retry</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default ErrorState;