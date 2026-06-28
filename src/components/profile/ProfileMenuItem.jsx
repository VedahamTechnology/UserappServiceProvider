import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

/**
 * Profile menu row — used in ProfileScreen.
 *
 *   <ProfileMenuItem icon="star" title="My Rating" onPress={...} />
 *   <ProfileMenuItem icon="map-pin" title="Manage Address" onPress={...} rightElement={<Switch />} />
 *
 * Behaviour:
 *   - Tap on the row body → `onPress` fires.
 *   - Tap on `rightElement` → element's own handler fires (e.g. Switch toggles).
 *     The rightElement is wrapped in a `<View>` that claims the responder so
 *     the row's `onPress` does NOT also fire — without this, tapping the
 *     Switch would both navigate AND toggle.
 */
const ProfileMenuItem = ({ icon, title, onPress, isLast, rightElement, color = COLORS.primary }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center justify-between py-4 ${
      !isLast ? 'border-b border-gray-50 dark:border-slate-700' : ''
    }`}
  >
    <View className="flex-row items-center flex-1">
      <View className="w-8 items-center">
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text className="ml-4 text-lg text-gray-700 dark:text-gray-200 font-medium">{title}</Text>
    </View>
    {rightElement ? (
      <View
        // Claim the touch so it doesn't bubble to the row's onPress.
        onStartShouldSetResponder={() => true}
        className="flex-row items-center"
      >
        {rightElement}
      </View>
    ) : (
      <Feather name="chevron-right" size={20} color={COLORS.textSubtle} />
    )}
  </TouchableOpacity>
);

export default ProfileMenuItem;
