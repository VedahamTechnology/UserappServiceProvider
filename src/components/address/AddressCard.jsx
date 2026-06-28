import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useT } from '../../i18n/useT';

const LABEL_ICONS = {
  Home: 'home',
  Work: 'briefcase',
  Other: 'map-pin',
};

const formatParts = (address) => {
  const parts = [address.street];
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(`- ${address.pincode}`);
  return parts.join(', ');
};

/**
 * Single address row. `variant`:
 *   - 'manage'  : editable list (ManageAddressScreen)
 *   - 'select'  : selectable list (CheckoutScreen)
 */
const AddressCard = ({ address, onPress, onEdit, onRemove, variant = 'manage' }) => {
  const t = useT();
  const label = address.label || 'Other';
  const iconName = LABEL_ICONS[label] || 'map-pin';
  const lines = formatParts(address);

  if (variant === 'select') {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`p-4 rounded-2xl mb-3 border flex-row items-center ${
          address.isSelected
            ? 'bg-primary/5 border-primary'
            : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
        }`}
      >
        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${address.isSelected ? 'border-primary' : 'border-gray-300'}`}>
          {address.isSelected ? <View className="w-3 h-3 bg-primary rounded-full" /> : null}
        </View>
        <View className="ml-4 flex-1">
          <View className="flex-row items-center">
            <Text className="font-black text-gray-900 dark:text-white text-base">{label}</Text>
            {address.isDefault ? (
              <View className="ml-2 bg-primary/10 px-2 py-0.5 rounded-md">
                <Text className="text-primary text-[10px] font-bold uppercase">
                  {t('common.default')}
                </Text>
              </View>
            ) : null}
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-4" numberOfLines={2}>
            {lines}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border-2 ${
        address.isDefault ? 'border-primary' : 'border-transparent'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Feather name={iconName} size={18} color={COLORS.primary} />
          <Text className="ml-2 font-bold text-gray-900 dark:text-white">{label}</Text>
          {address.isDefault ? (
            <View className="ml-3 bg-primary/10 px-2 py-0.5 rounded-md">
              <Text className="text-primary text-[10px] font-bold uppercase">
                {t('common.default')}
              </Text>
            </View>
          ) : null}
        </View>
        <View className="flex-row">
          {onEdit ? (
            <TouchableOpacity className="p-1 mr-1" onPress={onEdit}>
              <Feather name="edit-2" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null}
          {onRemove ? (
            <TouchableOpacity className="p-1" onPress={onRemove}>
              <Feather name="trash-2" size={16} color={COLORS.danger} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <Text className="text-gray-600 dark:text-gray-300 leading-5">{lines}</Text>
    </TouchableOpacity>
  );
};

export default AddressCard;
