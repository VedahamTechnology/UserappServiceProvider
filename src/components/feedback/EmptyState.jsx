import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import Button from '../common/Button';

const EmptyState = ({
  icon = 'info',
  title,
  subtitle,
  ctaLabel,
  onCtaPress,
  iconSize = 32,
  className = 'flex-1 items-center justify-center py-20',
}) => (
  <View className={className}>
    <View className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
      <Feather name={icon} size={iconSize} color={COLORS.textSubtle} />
    </View>
    {title ? (
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
    ) : null}
    {subtitle ? (
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 px-10">{subtitle}</Text>
    ) : null}
    {ctaLabel && onCtaPress ? (
      <View className="mt-6 px-10 w-full">
        <Button title={ctaLabel} onPress={onCtaPress} />
      </View>
    ) : null}
  </View>
);

export default EmptyState;