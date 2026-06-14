import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const MainBookingCard = ({ service, date, status, id, price, provider }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'completed': return 'text-green-500 bg-green-50 dark:bg-green-500/10';
      case 'confirmed': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
      case 'in progress': return 'text-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-500/10';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-500/10';
    }
  };

  return (
    <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{service}</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Service ID: #{id}</Text>
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
            <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold text-sm">{date}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Amount Paid</Text>
          <Text className="text-primaryPink font-extrabold text-lg mt-1">₹{price}</Text>
        </View>
      </View>

      {(status === 'Confirmed' || status === 'Pending') && (
        <View className="flex-row mt-6 space-x-3">
          <TouchableOpacity className="flex-1 bg-primaryPink/10 py-3 rounded-2xl items-center">
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

  const tabs = ['All', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  const bookings = [
    { id: 'HS1056', service: 'Bathroom Deep Cleaning', date: '18 Jun 2026, 02:00 PM', status: 'Confirmed', price: '899' },
    { id: 'HS1060', service: 'Kitchen Deep Cleaning', date: '20 Jun 2026, 11:00 AM', status: 'In Progress', price: '1299' },
    { id: 'HS1024', service: 'AC Deep Cleaning', date: '12 Jun 2026, 10:00 AM', status: 'Completed', price: '599' },
    { id: 'HS0988', service: 'Full Home Sanitization', date: '05 Jun 2026, 09:30 AM', status: 'Cancelled', price: '1299' },
  ];

  const filteredBookings = bookings.filter(b => 
    activeTab === 'All' ? true : b.status === activeTab
  );

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

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <MainBookingCard key={`booking-${booking.id}`} {...booking} />
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
