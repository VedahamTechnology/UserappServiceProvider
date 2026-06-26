import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { bookingService } from '../services/bookingService';
import { storage } from '../services/storageService';
import { primaryColor } from '../constants/color';
import { getCurrentLocation } from '../services/locationService';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function CheckoutScreen({ route, navigation }) {
  const service = route.params?.service;

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [selectedSlot, setSelectedSlot] = useState({ startTime: '10:00', endTime: '12:00' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerNotes, setCustomerNotes] = useState('');
  const [instructions, setInstructions] = useState('');
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

  // Mock addresses - In a real app, these would come from an API
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', street: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    { id: 2, label: 'Work', street: 'Tech Park, Phase 2', city: 'Mumbai', state: 'Maharashtra', pincode: '400051' }
  ]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await storage.getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const timeSlots = [
    { startTime: '09:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '13:00' },
    { startTime: '13:00', endTime: '15:00' },
    { startTime: '15:00', endTime: '17:00' },
    { startTime: '17:00', endTime: '19:00' },
  ];

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return formatDateKey(d);
  });

  const handleBooking = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book a service', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    setLoading(true);
    try {
      const selectedAddress = addresses[selectedAddressIndex];
      const currentLocation = await getCurrentLocation();

      // Try to find a vendor. If service has vendors array, use the first one.
      // Otherwise check if there's a vendorId directly on the service.
      let vendorId = null;

      if (service?.vendor?._id) {
        vendorId = service.vendor._id;
      }
      else if (service?.vendorId) {
        vendorId = service.vendorId._id || service.vendorId;
      }
      else if (service?.vendors?.length > 0) {
        vendorId =
          service.vendors[0]?.vendorId?._id ||
          service.vendors[0]?.vendorId;
      }

      console.log('Vendor ID:', vendorId);

      if (!vendorId) {
        // For demo purposes, if no vendor, we might use a dummy one or show error
        // But usually services from API should have vendors
        console.log(
          'SERVICE DATA',
          JSON.stringify(service, null, 2)
        );
        Alert.alert('No Professional Available', 'We couldn\'t find a professional for this service in your area right now.');
        setLoading(false);
        return;
      }

      // Combine date and time for bookingDate as required by some APIs (though request body example shows just date)
      // The example shows: "bookingDate": "2026-06-01"

      const bookingData = {
        serviceId: service._id,
        vendorId: vendorId,
        bookingDate: selectedDate,
        timeSlot: selectedSlot,
        serviceAddress: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,

          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,

          instructions: instructions
        },
        paymentMethod: paymentMethod,
        customerNotes: customerNotes
      };
      console.log(
        'BOOKING PAYLOAD',
        JSON.stringify(bookingData, null, 2)
      );
      console.log(
        'Service  Details',
        JSON.stringify(service, null, 2)
      );

      const response = await bookingService.createBooking(bookingData);


      if (response.success) {
        Alert.alert(
          'Booking Successful',
          'Your service has been booked successfully!',
          [{ text: 'View Bookings', onPress: () => navigation.navigate('Main', { screen: 'Bookings' }) }]
        );
      } else {
        Alert.alert('Booking Failed', response.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert('Booking Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-6" edges={['top']}>
        <Text className="text-lg font-black text-gray-900 dark:text-white text-center">Service details are missing</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-primaryColor px-6 py-3 rounded-2xl">
          <Text className="text-white font-black">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const basePrice = service.discountedPrice || service.basePrice;
  const platformFee = 49;
  const tax = Math.round(basePrice * 0.18); // 18% GST
  const totalAmount = basePrice + platformFee + tax;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-2 text-xl font-black text-gray-900 dark:text-white">Review Booking</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {/* Service Summary */}
          <View className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-5 mb-6 flex-row items-center border border-gray-100 dark:border-slate-700">
            <View className="bg-primaryColor/10 p-3 rounded-2xl">
              <Feather name="shopping-bag" size={24} color={primaryColor} />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 dark:text-white font-black text-lg">{service.name}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">{service.category?.name}</Text>
            </View>
            <Text className="text-primaryColor font-black text-lg">₹{basePrice}</Text>
          </View>

          {/* Date Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar-outline" size={20} color={primaryColor} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">Select Date</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((date) => {
                const d = new Date(date);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const isSelected = selectedDate === date;

                return (
                  //        

                  <TouchableOpacity
                    key={date}
                    onPress={() => {
                      console.log('Pressed:', date);
                      setSelectedDate(date);
                    }}
                    className={`w-16 h-20 rounded-2xl items-center justify-center mr-3 border ${isSelected
                      ? 'bg-primaryColor border-primaryColor '
                      : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'
                      }`}
                  >
                    <Text
                      className={`text-[10px] font-black uppercase ${isSelected ? 'text-white/80' : 'text-gray-400'
                        }`}
                    >
                      {dayName}
                    </Text>

                    <Text
                      className={`text-xl font-black mt-1 ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Slot Selection */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="time-outline" size={20} color={primaryColor} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">Select Time Slot</Text>
            </View>
            <View className="flex-row flex-wrap">
              {timeSlots.map((slot, index) => {
                const isSelected = selectedSlot.startTime === slot.startTime;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSlot(slot)}
                    className={`px-4 py-3 rounded-2xl mr-2 mb-2 border ${isSelected ? 'bg-primaryColor border-primaryColor  ' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'}`}
                  >
                    <Text className={`font-black text-sm ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Address Selection */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={20} color={primaryColor} />
                <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">Service Address</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ManageAddress')}>
                <Text className="text-primaryColor font-black text-xs uppercase tracking-widest">Manage</Text>
              </TouchableOpacity>
            </View>
            {addresses.map((addr, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAddressIndex(index)}
                className={`p-4 rounded-2xl mb-3 border flex-row items-center ${selectedAddressIndex === index ? 'bg-primaryColor/5 border-primaryColor   ' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedAddressIndex === index ? 'border-primaryColor' : 'border-gray-300'}`}>
                  {selectedAddressIndex === index && <View className="w-3 h-3 bg-primaryColor rounded-full" />}
                </View>
                <View className="ml-4 flex-1">
                  <Text className="font-black text-gray-900 dark:text-white text-base">{addr.label}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-4" numberOfLines={2}>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TextInput
              placeholder="Delivery instructions (e.g. Ring the bell twice)"
              placeholderTextColor="#9CA3AF"
              value={instructions}
              onChangeText={setInstructions}
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 mt-1"
            />
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="card-outline" size={20} color={primaryColor} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">Payment Method</Text>
            </View>
            <View className="flex-row space-x-3">
              {[
                { id: 'cash', label: 'Cash', icon: 'cash-outline' },
                { id: 'online', label: 'Online', icon: 'card-outline' }
              ].map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setPaymentMethod(method.id)}
                  className={`flex-1 flex-row items-center justify-center p-4 rounded-2xl border ${paymentMethod === method.id ? 'bg-primaryColor border-primaryColor  ' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}
                >
                  <Ionicons
                    name={method.icon}
                    size={20}
                    color={paymentMethod === method.id ? 'white' : '#9CA3AF'}
                  />
                  <Text className={`ml-2 font-black ${paymentMethod === method.id ? 'text-white' : 'text-gray-500'}`}>
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Notes */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="chatbubble-outline" size={20} color={primaryColor} />
              <Text className="text-lg font-black text-gray-900 dark:text-white ml-2">Notes for Professional</Text>
            </View>
            <TextInput
              placeholder="Any special instructions for the professional?"
              placeholderTextColor="#9CA3AF"
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
            <Text className="text-lg font-black text-gray-900 dark:text-white mb-4">Price Details</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Service Base Price</Text>
              <Text className="text-gray-900 dark:text-white font-bold">₹{basePrice}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Platform Fee</Text>
              <Text className="text-gray-900 dark:text-white font-bold">₹{platformFee}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Tax & GST</Text>
              <Text className="text-gray-900 dark:text-white font-bold">₹{tax}</Text>
            </View>
            <View className="h-[1px] bg-gray-200 dark:bg-slate-700 mb-4" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-black text-gray-900 dark:text-white">Total Amount</Text>
              <Text className="text-xl font-black text-primaryColor">₹{totalAmount}</Text>
            </View>
          </View>

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Button */}
      <View className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <TouchableOpacity
          onPress={handleBooking}
          disabled={loading}
          activeOpacity={0.8}
          className={`py-4 rounded-2xl items-center shadow-lg ${loading ? 'bg-gray-300' : 'bg-primaryColor  '}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">Confirm & Pay ₹{totalAmount}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
