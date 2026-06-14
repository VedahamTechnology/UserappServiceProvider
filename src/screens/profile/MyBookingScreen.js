import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const BookingCard = ({ service, date, status, id, price }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-500/10';
      case 'pending': return 'text-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
      default: return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
    }
  };

  return (
    <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">{service}</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-500 font-medium">ID: #{id}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
          <Text className="font-bold text-xs uppercase">{status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-4 space-x-4">
        <View className="flex-row items-center">
          <Feather name="calendar" size={14} color="#9CA3AF" />
          <Text className="ml-1.5 text-gray-500 dark:text-gray-400 text-sm">{date}</Text>
        </View>
        <View className="flex-row items-center">
          <Feather name="tag" size={14} color="#9CA3AF" />
          <Text className="ml-1.5 text-gray-700 dark:text-gray-300 font-bold text-sm">₹{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MyBookingScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">My Bookings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <BookingCard 
          service="AC Deep Cleaning" 
          date="12 Jun 2026, 10:00 AM" 
          status="Completed" 
          id="HS1024"
          price="599"
        />
        <BookingCard 
          service="Bathroom Deep Cleaning" 
          date="18 Jun 2026, 02:00 PM" 
          status="Pending" 
          id="HS1056"
          price="899"
        />
        <BookingCard 
          service="Full Home Sanitization" 
          date="05 Jun 2026, 09:30 AM" 
          status="Cancelled" 
          id="HS0988"
          price="1299"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
