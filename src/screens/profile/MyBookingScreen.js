import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { bookingService } from '../../services/bookingService';
import { primaryColor } from '../../constants/color';
import BookingActions from '../../components/common/BookingActions';

const BookingCard = ({ service, date, status, id, price, onUpdated }) => {
  const getStatusColor = () => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-500/10';
      case 'pending': return 'text-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
      default: return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
    }
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) : 'N/A';

  return (
    <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{service}</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-500 font-medium">ID: #{id?.slice(-6).toUpperCase() || 'N/A'}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
          <Text className="font-bold text-xs uppercase">{status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-4 space-x-4">
        <View className="flex-row items-center">
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text className="ml-1.5 text-gray-500 dark:text-gray-400 text-sm">{formattedDate}</Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="tag" size={14} color="#9CA3AF" />
          <Text className="ml-1.5 text-gray-700 dark:text-gray-300 font-bold text-sm">₹{price}</Text>
        </View>
      </View>

      <BookingActions booking={{ id, status, date }} onUpdated={onUpdated} />
    </TouchableOpacity>
  );
};

export default function MyBookingScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await bookingService.getUserBookings();
      if (response.success) {
       const bookings = response.data?.bookings || response.data || [];

const mappedBookings = bookings.map(item => ({
  id: item._id,
  service: item.serviceId?.name || 'Service',
  date: item.bookingDate || item.createdAt,
  status: item.status,
  price: item.totalPrice || item.price || 0,
}));
        setBookings(mappedBookings);
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Something went wrong while fetching bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    fetchBookings(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">My Bookings</Text>
      </View>

      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primaryColor]} />
        }
      >
        {loading && !refreshing ? (
          <View className="py-20">
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        ) : bookings.length > 0 ? (
          bookings.map(booking => (
            <BookingCard
              key={`booking-${booking.id}`}
              {...booking}
              onUpdated={() => fetchBookings()}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
              <Feather name="calendar" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">No Bookings</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 px-10">
              You haven't made any bookings yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

