import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/radii';

/**
 * Standard full-width primary button.
 * `variant`: 'primary' (default), 'danger', 'muted'
 */
const Button = ({
  onPress,
  title,
  loading,
  disabled,
  variant = 'primary',
  className = '',
  textClassName = '',
  iconLeft,
}) => {
  const bg = variant === 'danger'
    ? (loading || disabled ? 'bg-gray-300' : 'bg-danger')
    : variant === 'muted'
      ? 'bg-gray-100 dark:bg-slate-700'
      : (loading || disabled ? 'bg-gray-300' : 'bg-primary');

  const text = variant === 'muted'
    ? 'text-gray-600 dark:text-gray-300'
    : 'text-white';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
      className={`${RADIUS.md} py-4 items-center flex-row justify-center ${bg} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <>
          {iconLeft}
          <Text className={`font-bold text-base ${text} ${textClassName}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;