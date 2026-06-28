import React from 'react';
import { View } from 'react-native';
import { RADIUS } from '../../constants/radii';
import { SHADOW } from '../../constants/shadows';

/**
 * Surface card with consistent radius, padding, background, and shadow.
 *
 * <Card variant="elevated">…</Card>
 */
const Card = ({
  children,
  variant = 'default',
  className = '',
  bgClass = 'bg-white dark:bg-slate-800',
}) => {
  const radius = RADIUS.xl;
  const shadow = variant === 'elevated' ? SHADOW.sm : variant === 'flat' ? '' : SHADOW.sm;
  const border = variant === 'outlined' ? 'border border-gray-100 dark:border-slate-700' : '';
  return (
    <View className={`${radius} ${shadow} ${bgClass} ${border} ${className}`}>
      {children}
    </View>
  );
};

export default Card;