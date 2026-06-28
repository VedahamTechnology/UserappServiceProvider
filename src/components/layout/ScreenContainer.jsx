import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

/**
 * Standard screen wrapper with safe-area + background.
 * Defaults to white in light mode, slate-900 in dark mode.
 */
const ScreenContainer = ({
  children,
  edges = ['top'],
  bgClass = 'bg-white dark:bg-slate-900',
  style,
  className = '',
}) => (
  <SafeAreaView edges={edges} className={`flex-1 ${bgClass} ${className}`} style={style}>
    {children}
  </SafeAreaView>
);

export default ScreenContainer;

// Named export alias — allows `import { ScreenContainer, ScreenHeader } from '...'`
// alongside the default export, matching the pattern used by every screen.
export { ScreenContainer };

export const ScreenHeader = ({
  title,
  onBack,
  right,
  bgClass = 'bg-white dark:bg-slate-900',
  titleClassName = 'text-xl font-bold dark:text-white',
}) => (
  <View className={`flex-row items-center px-4 py-3 ${bgClass} border-b border-gray-100 dark:border-slate-800`}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
        <Feather name="arrow-left" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    ) : null}
    <Text className={`${onBack ? 'ml-2' : ''} ${titleClassName} flex-1`} numberOfLines={1}>
      {title}
    </Text>
    {right}
  </View>
);