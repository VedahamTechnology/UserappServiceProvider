import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const RatingCard = ({ service, professional, rating, review, date }) => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="flex-row justify-between items-start">
      <View>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{service}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">with {professional}</Text>
      </View>
      <View className="flex-row items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
        <Text className="text-green-600 font-bold mr-1">{rating}</Text>
        <Feather name="star" size={14} color="#16a34a" fill="#16a34a" />
      </View>
    </View>
    
    <Text className="text-gray-600 dark:text-gray-300 mt-3 italic">"{review}"</Text>
    
    <View className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-700">
      <Text className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">{date}</Text>
    </View>
  </View>
);

export default function MyRatingScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">My Ratings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <RatingCard 
          service="Sofa Cleaning" 
          professional="Rajesh Kumar" 
          rating="5.0" 
          review="Excellent service! The sofa looks brand new now. Very professional behavior." 
          date="10 May 2026"
        />
        <RatingCard 
          service="Kitchen Cleaning" 
          professional="Sunita Sharma" 
          rating="4.5" 
          review="Great attention to detail. Only missed a small corner under the sink but otherwise perfect." 
          date="22 Apr 2026"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
