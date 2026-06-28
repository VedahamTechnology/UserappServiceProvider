import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { useToast } from '../context/ToastContext';
import { useT } from '../i18n/useT';
import { COLORS } from '../constants/colors';
import { formatINR, computeBookingTotal } from '../utils/currency';
import { mapService } from '../utils/mappers';

import Button from '../components/common/Button';
import DateStrip from '../components/booking/DateStrip';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import AddressCard from '../components/address/AddressCard';
import { ScreenContainer, ScreenHeader } from '../components/layout/ScreenContainer';

import { bookingService } from '../services/bookingService';
import { getCurrentLocation } from '../services/locationService';

export default function CheckoutScreen({ route, navigation }) {
  const t = useT();
  const toast = useToast();
  const { user } = useAuth();
  const { addresses, refresh, defaultAddress } = useAddress();

  const incoming = route.params?.service;
  const service = incoming ? mapService(incoming) : null;

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [selectedSlot, setSelectedSlot] = useState({ startTime: '10:00', endTime: '12:00' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerNotes, setCustomerNotes] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refetch addresses every time the user lands on this screen.
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  // Default the selected address whenever the address list changes.
  React.useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [selectedAddressId, defaultAddress]);

  const handleBooking = async () => {
    if (!user) {
      toast.show(t('checkout.loginRequired'), 'warning');
      return;
    }
    if (!selectedAddressId) {
      toast.show(t('checkout.addressRequired'), 'warning');
      return;
    }

    setLoading(true);
    try {
      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

      // Resolve a vendorId — backend requires it.
      const vendorId =
        incoming?.vendor?._id ||
        incoming?.vendorId?._id ||
        incoming?.vendorId ||
        incoming?.vendors?.[0]?.vendorId?._id ||
        incoming?.vendors?.[0]?.vendorId ||
        null;

      if (!vendorId) {
        toast.show(t('checkout.noProfessional'), 'error');
        setLoading(false);
        return;
      }

      let coords = { latitude: null, longitude: null };
      try {
        const loc = await getCurrentLocation();
        coords = { latitude: loc.latitude, longitude: loc.longitude };
      } catch {
        // Non-fatal — backend should accept missing coords if address already has them.
      }

      const payload = {
        serviceId: service.id,
        vendorId,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        serviceAddress: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          latitude: coords.latitude,
          longitude: coords.longitude,
          instructions,
        },
        paymentMethod,
        customerNotes,
      };

      const response = await bookingService.createBooking(payload);
      if (response?.success) {
        toast.show(t('checkout.bookingSuccessMessage'), 'success');
        navigation.navigate('Main', { screen: 'Bookings' });
      } else {
        toast.show(response?.message || t('errors.failedToSave'), 'error');
      }
    } catch (err) {
      toast.show(err?.message || t('errors.failedToSave'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-black text-gray-900 dark:text-white text-center">
            {t('checkout.serviceDetailsMissing')}
          </Text>
          <Button
            title={t('common.goBack')}
            onPress={() => navigation.goBack()}
            className="mt-4"
          />
        </View>
      </ScreenContainer>
    );
  }

  const basePrice = service.discountedPrice || service.basePrice;
  const totalAmount = computeBookingTotal(basePrice);

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title={t('checkout.title')} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {/* Service Summary */}
          <View className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5 mb-6 flex-row items-center border border-gray-100 dark:border-slate-700">
            <View className="bg-primary/10 p-3 rounded-2xl">
              <Feather name="shopping-bag" size={24} color={COLORS.primary} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 dark:text-white font-black text-lg">{service.name}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {service.categoryName}
              </Text>
            </View>
            <Text className="text-primary font-black text-lg">{formatINR(basePrice)}</Text>
          </View>

          {/* Date Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">
                {t('checkout.selectDate')}
              </Text>
            </View>
            <DateStrip value={selectedDate} onChange={setSelectedDate} />
          </View>

          {/* Time Slot Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">
                {t('checkout.selectTimeSlot')}
              </Text>
            </View>
            <TimeSlotPicker value={selectedSlot} onChange={setSelectedSlot} />
          </View>

          {/* Address Selection */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">
                  {t('checkout.serviceAddress')}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ManageAddress')}>
                <Text className="text-primary font-black text-xs uppercase tracking-widest">
                  {t('common.manage')}
                </Text>
              </TouchableOpacity>
            </View>

            {addresses.length === 0 ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('ManageAddress')}
                className="p-5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 items-center"
              >
                <Feather name="plus-circle" size={22} color={COLORS.primary} />
                <Text className="text-primary font-black mt-2 uppercase tracking-widest text-xs">
                  {t('checkout.addAddress')}
                </Text>
              </TouchableOpacity>
            ) : (
              addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={{ ...addr, isSelected: selectedAddressId === addr.id }}
                  variant="select"
                  onPress={() => setSelectedAddressId(addr.id)}
                />
              ))
            )}

            <TextInput
              placeholder={t('checkout.instructionsPlaceholder')}
              placeholderTextColor={COLORS.placeholder}
              value={instructions}
              onChangeText={setInstructions}
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 mt-1"
            />
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="card-outline" size={20} color={COLORS.primary} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">
                {t('checkout.paymentMethod')}
              </Text>
            </View>
            <View className="flex-row space-x-3">
              {[
                { id: 'cash', label: t('checkout.cash'), icon: 'cash-outline' },
                { id: 'online', label: t('checkout.online'), icon: 'card-outline' },
              ].map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setPaymentMethod(method.id)}
                  className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl border ${
                    paymentMethod === method.id
                      ? 'bg-primary border-primary'
                      : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                  }`}
                >
                  <Ionicons
                    name={method.icon}
                    size={20}
                    color={paymentMethod === method.id ? 'white' : COLORS.textSubtle}
                  />
                  <Text
                    className={`ml-2 font-black ${
                      paymentMethod === method.id ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Notes */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">
                {t('checkout.notesForProfessional')}
              </Text>
            </View>
            <TextInput
              placeholder={t('checkout.notesPlaceholder')}
              placeholderTextColor={COLORS.placeholder}
              multiline
              numberOfLines={3}
              value={customerNotes}
              onChangeText={setCustomerNotes}
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700"
              style={{ textAlignVertical: 'top', height: 100 }}
            />
          </View>

          {/* Price Breakdown */}
          <View className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 mb-10 border border-gray-100 dark:border-slate-700">
            <Text className="text-lg font-black text-gray-900 dark:text-white mb-4">
              {t('checkout.priceDetails')}
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">
                {t('checkout.serviceBasePrice')}
              </Text>
              <Text className="text-gray-900 dark:text-white font-bold">{formatINR(basePrice)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">
                {t('checkout.platformFee')}
              </Text>
              <Text className="text-gray-900 dark:text-white font-bold">
                {formatINR(49)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">
                {t('checkout.taxGst')}
              </Text>
              <Text className="text-gray-900 dark:text-white font-bold">
                {formatINR(Math.round(basePrice * 0.18))}
              </Text>
            </View>
            <View className="h-[1px] bg-gray-200 dark:bg-slate-700 mb-4" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-black text-gray-900 dark:text-white">
                {t('checkout.totalAmount')}
              </Text>
              <Text className="text-xl font-black text-primary">{formatINR(totalAmount)}</Text>
            </View>
          </View>

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <Button
          title={t('checkout.confirmAndPay', { amount: formatINR(totalAmount) })}
          onPress={handleBooking}
          loading={loading}
        />
      </View>
    </ScreenContainer>
  );
}