import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useT } from '../../i18n/useT';
import { getCurrentLocation } from '../../services/locationService';
import { INDIAN_STATES } from '../../utils/validation';

import BottomSheetModal from '../common/BottomSheetModal';
import Button from '../common/Button';
import FormField from '../common/FormField';

const LABEL_OPTIONS = ['Home', 'Work', 'Other'];

const emptyForm = () => ({
  label: 'Home',
  street: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
});

/**
 * Bottom-sheet modal for adding or editing an address.
 *
 * Props:
 *   - visible          controls mount/visibility
 *   - onClose          close callback
 *   - onSubmit         async (form, editingId) => void — throws to surface a save error
 *   - editingId        address id when editing; null/undefined when adding
 *   - initialForm      optional prefill values when editing
 *
 * <AddressFormModal visible={...} onClose={...} onSubmit={...} editingId={id} initialForm={...} />
 */
const AddressFormModal = ({ visible, onClose, onSubmit, editingId = null, initialForm = null }) => {
  const t = useT();

  const [internalEditingId, setInternalEditingId] = useState(editingId);
  const [form, setForm] = useState(initialForm || emptyForm());
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (visible) {
      setInternalEditingId(editingId);
      setForm(initialForm || emptyForm());
    } else {
      setForm(emptyForm());
      setInternalEditingId(null);
    }
  }, [visible, editingId, initialForm]);

  const set = (k) => (v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      const parts = (loc.fullAddress || '').split(',').map((s) => s.trim()).filter(Boolean);
      const shortParts = (loc.shortAddress || '').split(',').map((s) => s.trim()).filter(Boolean);
      const pincodeMatch = parts.find((p) => /^\d{4,6}$/.test(p));
      const stateMatch = parts.find((p) => INDIAN_STATES.includes(p));
      const stateIdx = stateMatch ? parts.indexOf(stateMatch) : -1;
      const pincodeIdx = pincodeMatch ? parts.indexOf(pincodeMatch) : -1;
      let cityMatch = '';
      for (let i = (stateIdx >= 0 ? stateIdx : pincodeIdx >= 0 ? pincodeIdx : parts.length) - 1; i >= 0; i--) {
        if (parts[i] && !/^\d/.test(parts[i]) && !INDIAN_STATES.includes(parts[i])) {
          cityMatch = parts[i];
          break;
        }
      }
      const streetGuess = shortParts.join(', ') || loc.fullAddress || '';

      setForm((prev) => ({
        ...prev,
        street: prev.street.trim() ? prev.street : streetGuess,
        city: prev.city.trim() ? prev.city : cityMatch,
        state: prev.state.trim() ? prev.state : (stateMatch || ''),
        pincode: prev.pincode.trim() ? prev.pincode : (pincodeMatch || ''),
      }));
    } catch (error) {
      Alert.alert(t('addresses.locationErrorTitle'), error.message || t('errors.locationDenied'));
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    if (!form.street.trim() || !form.city.trim() || !form.pincode.trim()) {
      Alert.alert(t('common.warning'), t('addresses.missingFields'));
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ ...form }, internalEditingId);
      onClose();
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('errors.failedToSave'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={internalEditingId ? t('addresses.editTitle') : t('addresses.addTitle')}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={handleUseCurrentLocation}
          disabled={locating}
          className="flex-row items-center justify-center bg-primary/10 border border-primary/30 rounded-2xl py-3 mb-5"
        >
          {locating ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <Feather name="crosshair" size={18} color={COLORS.primary} />
              <Text className="ml-2 text-primary font-bold">
                {t('addresses.captureCurrentLocation')}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          {t('common.default')}
        </Text>
        <View className="flex-row space-x-3 mb-5">
          {LABEL_OPTIONS.map((lbl) => {
            const active = form.label === lbl;
            return (
              <TouchableOpacity
                key={lbl}
                onPress={() => set('label')(lbl)}
                className={`px-6 py-2 rounded-full border ${
                  active ? 'bg-primary border-primary' : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <Text className={`font-bold ${active ? 'text-white' : 'text-gray-500'}`}>
                  {lbl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FormField
          label={t('addresses.fieldStreet')}
          value={form.street}
          onChangeText={set('street')}
          placeholder={t('addresses.streetPlaceholder')}
        />
        <FormField
          label={t('addresses.fieldCity')}
          value={form.city}
          onChangeText={set('city')}
          placeholder={t('addresses.cityPlaceholder')}
        />
        <FormField
          label={t('addresses.fieldState')}
          value={form.state}
          onChangeText={set('state')}
          placeholder={t('addresses.statePlaceholder')}
        />
        <FormField
          label={t('addresses.fieldPincode')}
          value={form.pincode}
          onChangeText={set('pincode')}
          placeholder={t('addresses.pincodePlaceholder')}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          onPress={() => set('isDefault')(!form.isDefault)}
          className="flex-row items-center mb-6 mt-3"
        >
          <View
            className={`w-5 h-5 rounded border-2 items-center justify-center ${
              form.isDefault ? 'bg-primary border-primary' : 'border-gray-300'
            }`}
          >
            {form.isDefault ? <Feather name="check" size={14} color="white" /> : null}
          </View>
          <Text className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
            {t('addresses.setAsDefault')}
          </Text>
        </TouchableOpacity>

        <Button
          title={internalEditingId ? t('addresses.updateAddress') : t('addresses.saveAddress')}
          onPress={handleSave}
          loading={saving}
        />
      </ScrollView>
    </BottomSheetModal>
  );
};

export default AddressFormModal;
