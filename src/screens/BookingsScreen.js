import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { bookingService } from '../services/bookingService';

const MainBookingCard = ({ service, date, status, id, price, provider, navigation }) => {
  const getStatusColor = () => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-500/10';
      case 'confirmed': 
      case 'accepted': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
      case 'in progress': return 'text-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10';
      case 'cancelled': 
      case 'rejected': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-500/10';
    }
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  return (
    <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{service}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Booking ID: #{id?.slice(-6).toUpperCase() || 'N/A'}</Text>
        </View>
        <View className={`px-3 py-1.5 rounded-xl ${getStatusColor()}`}>
          <Text className="font-bold text-[10px] uppercase tracking-wider">{status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-6 pt-4 border-t border-gray-50 dark:border-slate-700">
        <View className="flex-1">
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Date & Time</Text>
          <View className="flex-row items-center mt-1">
            <Feather name="calendar" size={14} color="#FF8383" />
            <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold text-sm">{formattedDate}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Amount Paid</Text>
          <Text className="text-primaryPink font-extrabold text-lg mt-1">₹{price}</Text>
        </View>
      </View>

      {(status?.toLowerCase() === 'confirmed' || status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'accepted') && (
        <View className="flex-row mt-6 space-x-3">
          <TouchableOpacity className="flex-1 bg-primaryPink/10 py-3 rounded-2xl items-center mx-3">
            <Text className="text-primaryPink font-bold">Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-100 dark:bg-slate-700 py-3 rounded-2xl items-center">
            <Text className="text-gray-600 dark:text-gray-300 font-bold">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function BookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = ['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'];

  const fetchBookings = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await bookingService.getUserBookings({
        status: activeTab === 'All' ? null : activeTab.toLowerCase()
      });
      
      if (response.success) {
        // Map the API response to our card format
        const mappedBookings = response.data.map(item => ({
          id: item._id,
          service: item.serviceId?.name || 'Service',
          date: item.scheduledDate || item.createdAt,
          status: item.status,
          price: item.totalPrice || item.price || '0',
          provider: item.providerId?.name
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
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-slate-900 shadow-sm">
        <View className="px-4 py-4">
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Bookings
          </Text>
        </View>
        
        {/* Scrollable Tabs */}
        <View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-4"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View className="flex-row bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
              {tabs.map(tab => (
                <TouchableOpacity 
                  key={`tab-${tab}`}
                  onPress={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl items-center ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Text className={`font-bold whitespace-nowrap ${activeTab === tab ? 'text-primaryPink' : 'text-gray-500 dark:text-gray-400'}`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <ScrollView 
        className="flex-1 p-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF8383']} />
        }
      >
        {loading && !refreshing ? (
          <View className="py-20">
            <ActivityIndicator size="large" color="#FF8383" />
          </View>
        ) : bookings.length > 0 ? (
          bookings.map(booking => (
            <MainBookingCard key={`booking-${booking.id}`} {...booking} navigation={navigation} />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
              <Feather name="calendar" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">No {activeTab} Bookings</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 px-10">
              {activeTab === 'All' ? "You haven't made any bookings yet." : `You don't have any ${activeTab.toLowerCase()} bookings.`}
            </Text>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}

