import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';
import { addressService } from '../../services/addressService';
import { getCurrentLocation } from '../../services/locationService';

const LABEL_OPTIONS = ['Home', 'Work', 'Other'];

const emptyForm = () => ({
  label: 'Home',
  street: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
});

const AddressCard = ({ address, onSelect, onEdit, onRemove }) => {
  const label = address.label || 'Other';
  const iconName = label === 'Home' ? 'home' : label === 'Work' ? 'briefcase' : 'map-pin';

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border-2 ${
        address.isDefault ? 'border-primaryColor' : 'border-transparent'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Feather name={iconName} size={18} color={primaryColor} />
          <Text className="ml-2 font-bold text-gray-900 dark:text-white">{label}</Text>
          {address.isDefault && (
            <View className="ml-3 bg-primaryColor/10 px-2 py-0.5 rounded-md">
              <Text className="text-primaryColor text-[10px] font-bold uppercase">Default</Text>
            </View>
          )}
        </View>
        <View className="flex-row">
          <TouchableOpacity className="p-1 mr-1" onPress={onEdit}>
            <Feather name="edit-2" size={16} color={primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1" onPress={onRemove}>
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-gray-600 dark:text-gray-300 leading-5">
        {address.street}
        {address.city ? `, ${address.city}` : ''}
        {address.state ? `, ${address.state}` : ''}
        {address.pincode ? ` - ${address.pincode}` : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default function ManageAddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const fetchAddresses = useCallback(async (isPullRefresh = false) => {
    try {
      if (isPullRefresh) setRefreshing(true);
      const response = await addressService.getAddresses();
      if (response.success) {
        setAddresses(response.addresses || response.data || []);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setModalVisible(true);
  };

  const openEditModal = (address) => {
    setEditingId(address._id);
    setForm({
      label: address.label || 'Other',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: !!address.isDefault,
    });
    setModalVisible(true);
  };

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      // Best-effort parsing of the comma-separated address returned by expo-location.
      const parts = (loc.fullAddress || '').split(',').map((s) => s.trim()).filter(Boolean);
      const shortParts = (loc.shortAddress || '').split(',').map((s) => s.trim()).filter(Boolean);

      // Pincode is the first token in fullAddress that looks like a 4-6 digit number.
      const pincodeMatch = parts.find((p) => /^\d{4,6}$/.test(p));
      // State is typically a known Indian state name; fall back to a near-end token.
      const INDIAN_STATES = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Dadra and Nagar Haveli',
        'Daman and Diu', 'Lakshadweep', 'Puducherry',
      ];
      const stateMatch = parts.find((p) => INDIAN_STATES.includes(p));
      // City: the token just before the state (or just before pincode) in fullAddress.
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
      Alert.alert('Location Error', error.message || 'Could not fetch your current location.');
    } finally {
      setLocating(false);
    }
  };

  const handleSelect = async (address) => {
    if (address.isDefault) {
      Alert.alert('Already Default', 'This address is already your default.');
      return;
    }
    try {
      const response = await addressService.setDefaultAddress(address._id);
      if (response.success) {
        // If backend returned an updated address object, splice it in; otherwise just flip the flag locally.
        const updated =
          response.address ||
          response.data ||
          (Array.isArray(response.addresses)
            ? response.addresses.find((a) => a._id === address._id)
            : null);
        setAddresses((prev) => {
          if (updated && updated._id) {
            return prev.map((a) => (a._id === address._id ? updated : { ...a, isDefault: false }));
          }
          return prev.map((a) => ({ ...a, isDefault: a._id === address._id }));
        });
        Alert.alert('Success', 'Default address updated');
      } else {
        Alert.alert('Error', response.message || 'Failed to set default address');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to set default address');
    }
  };

  const handleSave = async () => {
    if (!form.street.trim() || !form.city.trim() || !form.pincode.trim()) {
      Alert.alert('Missing Fields', 'Street, city and pincode are required.');
      return;
    }

    setSaving(true);
    try {
      // Capture coordinates silently at save time. For edits, keep existing
      // coords if the address already has them; otherwise fetch fresh.
      let latitude;
      let longitude;
      if (editingId) {
        const existing = addresses.find((a) => a._id === editingId);
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
          Alert.alert(
            'Location Needed',
            locError.message ||
              'We need your location to save this address. Please enable location access and try again.'
          );
          setSaving(false);
          return;
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

      if (editingId) {
        const response = await addressService.updateAddress(editingId, payload);
        if (!response.success) {
          Alert.alert('Error', response.message || 'Failed to update address');
          return;
        }
        // Backend may return either a single address object or the full updated list.
        const updated =
          response.address ||
          response.data ||
          (Array.isArray(response.addresses)
            ? response.addresses.find((a) => a._id === editingId) ||
              response.addresses[response.addresses.length - 1]
            : null) ||
          { _id: editingId, ...payload };
        setAddresses((prev) => prev.map((a) => (a._id === editingId ? updated : a)));
        if (payload.isDefault) {
          setAddresses((prev) =>
            prev.map((a) => ({ ...a, isDefault: a._id === editingId }))
          );
        }
        Alert.alert('Success', 'Address updated');
      } else {
        const response = await addressService.addAddress(payload);
        if (!response.success) {
          Alert.alert('Error', response.message || 'Failed to add address');
          return;
        }
        // Backend may return either a single address object or the full updated list.
        const created =
          response.address ||
          response.data ||
          (Array.isArray(response.addresses)
            ? response.addresses[response.addresses.length - 1]
            : null);
        if (created && created._id) {
          if (payload.isDefault) {
            setAddresses((prev) => [
              ...prev.map((a) => ({ ...a, isDefault: false })),
              created,
            ]);
          } else {
            setAddresses((prev) => [...prev, created]);
          }
        } else {
          // Fall back to a full refresh so the UI is guaranteed to be in sync with the server.
          await fetchAddresses();
        }
        Alert.alert('Success', 'Address added');
      }
      setModalVisible(false);
      setForm(emptyForm());
      setEditingId(null);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (address) => {
    if (addresses.length === 1) {
      Alert.alert('Cannot Remove', 'You need at least one saved address.');
      return;
    }
    Alert.alert(
      'Remove Address',
      'This will hide the address from your list. (Backend removal is not supported in this version.)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setAddresses((prev) => prev.filter((a) => a._id !== address._id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Manage Addresses</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 p-4"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchAddresses(true)}
              tintColor={primaryColor}
            />
          }
        >
          {addresses.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Feather name="map-pin" size={42} color="#9CA3AF" />
              <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center">
                No saved addresses yet.{'\n'}Tap below to add your first address.
              </Text>
            </View>
          ) : (
            addresses
              .filter((item) => item && item._id)
              .map((item) => (
                <AddressCard
                  key={item._id}
                  address={item}
                  onSelect={() => handleSelect(item)}
                  onEdit={() => openEditModal(item)}
                  onRemove={() => handleRemove(item)}
                />
              ))
          )}

          <TouchableOpacity
            onPress={openAddModal}
            className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-5 mt-2"
          >
            <Feather name="plus-circle" size={20} color={primaryColor} />
            <Text className="ml-2 font-bold text-gray-700 dark:text-gray-300">Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Add / Edit Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold dark:text-white">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                disabled={locating}
                className="flex-row items-center justify-center bg-primaryColor/10 border border-primaryColor/30 rounded-2xl py-3 mb-5"
              >
                {locating ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                  <>
                    <Feather name="crosshair" size={18} color={primaryColor} />
                    <Text className="ml-2 text-primaryColor font-bold">
                      Capture Current Location
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Label</Text>
              <View className="flex-row space-x-3 mb-5">
                {LABEL_OPTIONS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setForm({ ...form, label: t })}
                    className={`px-6 py-2 rounded-full border ${
                      form.label === t
                        ? 'bg-primaryColor border-primaryColor'
                        : 'border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <Text className={`font-bold ${form.label === t ? 'text-white' : 'text-gray-500'}`}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FormField
                label="Street / House"
                value={form.street}
                onChangeText={(v) => setForm({ ...form, street: v })}
                placeholder="123 Street Name"
              />
              <FormField
                label="City"
                value={form.city}
                onChangeText={(v) => setForm({ ...form, city: v })}
                placeholder="Mumbai"
              />
              <FormField
                label="State"
                value={form.state}
                onChangeText={(v) => setForm({ ...form, state: v })}
                placeholder="Maharashtra"
              />
              <FormField
                label="Pincode"
                value={form.pincode}
                onChangeText={(v) => setForm({ ...form, pincode: v })}
                placeholder="400001"
                keyboardType="number-pad"
              />

              <TouchableOpacity
                onPress={() => setForm({ ...form, isDefault: !form.isDefault })}
                className="flex-row items-center mb-6 mt-3"
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    form.isDefault ? 'bg-primaryColor border-primaryColor' : 'border-gray-300'
                  }`}
                >
                  {form.isDefault && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                  Set as default address
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className={`py-4 rounded-2xl items-center ${saving ? 'bg-gray-300' : 'bg-primaryColor'}`}
              >
                {saving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {editingId ? 'Update Address' : 'Save Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const FormField = ({ label, ...inputProps }) => (
  <View className="mb-3">
    <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
    <TextInput
      placeholderTextColor="#9CA3AF"
      className="bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700"
      {...inputProps}
    />
  </View>
);
