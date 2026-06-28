import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';

const LoadingView = ({ size = 'large', className = 'flex-1 justify-center items-center' }) => (
  <View className={className}>
    <ActivityIndicator size={size} color={COLORS.primary} />
  </View>
);

export default LoadingView;