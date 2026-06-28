import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/radii';

/**
 * Standard bottom-sheet modal — used by CancelBooking, RescheduleBooking,
 * AddAddress, etc.
 */
const BottomSheetModal = ({
  visible,
  onClose,
  title,
  children,
  maxHeight = '90%',
}) => (
  <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <View className="flex-1 justify-end bg-black/50">
      <View className={`bg-white dark:bg-slate-900 rounded-t-3xl p-6 ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold dark:text-white">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={COLORS.textSubtle} />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
  </Modal>
);

export default BottomSheetModal;