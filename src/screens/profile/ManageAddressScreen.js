import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAddress } from '../../context/AddressContext';
import { useToast } from '../../context/ToastContext';
import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import AddressCard from '../../components/address/AddressCard';
import AddressFormModal from '../../components/address/AddressFormModal';
import LoadingView from '../../components/feedback/LoadingView';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import { ScrollView } from 'react-native';

import { getCurrentLocation } from '../../services/locationService';

export default function ManageAddressScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const {
    addresses,
    loading,
    error,
    refresh,
    add,
    update,
    setDefault,
  } = useAddress();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialForm, setInitialForm] = useState(null);

  const openAdd = useCallback(() => {
    setEditingId(null);
    setInitialForm(null);
    setModalVisible(true);
  }, []);

  const openEdit = useCallback((address) => {
    setEditingId(address.id);
    setInitialForm({
      label: address.label || 'Other',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: !!address.isDefault,
    });
    setModalVisible(true);
  }, []);

  const handleSubmit = useCallback(
    async (form, editId) => {
      // For edits, preserve existing coords if available; otherwise fetch fresh.
      let latitude;
      let longitude;
      if (editId) {
        const existing = addresses.find((a) => a.id === editId);
        if (existing && existing.latitude != null && existing.longitude != null) {
          latitude = existing.latitude;
          longitude = existing.longitude;
        }
      }
      if (latitude == null || longitude == null) {
        try {
          const loc = await getCurrentLocation();
          latitude = loc.latitude;
          longitude = loc.longitude;
        } catch (locError) {
          toast.show(locError?.message || t('addresses.locationNeeded'), 'error');
          throw locError;
        }
      }

      const payload = {
        label: form.label,
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        latitude,
        longitude,
        isDefault: form.isDefault,
      };

      try {
        if (editId) {
          await update(editId, payload);
          toast.show(t('addresses.addressUpdated'), 'success');
        } else {
          await add(payload);
          toast.show(t('addresses.addressAdded'), 'success');
        }
      } catch (e) {
        toast.show(e?.message || t('errors.failedToSave'), 'error');
        throw e;
      }
    },
    [addresses, add, update, toast, t],
  );

  const handleSetDefault = useCallback(
    async (address) => {
      if (address.isDefault) {
        toast.show(t('addresses.alreadyDefault'), 'info');
        return;
      }
      try {
        await setDefault(address.id);
        toast.show(t('addresses.defaultUpdated'), 'success');
      } catch (e) {
        toast.show(e?.message || t('errors.failedToSave'), 'error');
      }
    },
    [setDefault, toast, t],
  );

  const handleRemove = useCallback(
    (address) => {
      if (addresses.length === 1) {
        toast.show(t('addresses.cannotRemoveLast'), 'warning');
        return;
      }
      // Backend has no DELETE; emulate by clearing the local cache entry.
      toast.show(t('addresses.removeMessage'), 'info');
      // For now, simply un-default it (no actual delete on the server yet).
      if (address.isDefault) {
        const next = addresses.find((a) => a.id !== address.id);
        if (next) handleSetDefault(next);
      }
    },
    [addresses, handleSetDefault, toast, t],
  );

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('addresses.title')} onBack={() => navigation.goBack()} />

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refresh} />
      ) : (
        <ScrollView className="flex-1 p-4">
          {addresses.length === 0 ? (
            <EmptyState icon="map-pin" title={t('addresses.empty')} />
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onPress={() => handleSetDefault(address)}
                onEdit={() => openEdit(address)}
                onRemove={() => handleRemove(address)}
              />
            ))
          )}

          <TouchableOpacity
            onPress={openAdd}
            className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-5 mt-2"
          >
            <Feather name="plus-circle" size={20} color={COLORS.primary} />
            <Text className="ml-2 text-primary font-bold">
              {t('addresses.addNew') || 'Add new address'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <AddressFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        editingId={editingId}
        initialForm={initialForm}
      />
    </ScreenContainer>
  );
}