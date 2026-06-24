import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';

const DealCard = ({ title, description, code, expiry }) => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">{description}</Text>
      </View>
      <View className="bg-primaryColor/10 px-3 py-1 rounded-full">
        <Text className="text-primaryColor font-bold text-xs">DEAL</Text>
      </View>
    </View>
    
    <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
      <View>
        <Text className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Use Code</Text>
        <Text className="text-primaryColor font-bold text-lg tracking-widest">{code}</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Expires</Text>
        <Text className="text-gray-700 dark:text-gray-300 font-semibold">{expiry}</Text>
      </View>
    </View>
  </View>
);

export default function ScrapDealsScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Scrap Deals</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <DealCard 
          title="Metal Scrap Bonus" 
          description="Get extra 10% value on all metal scrap collections above 50kg."
          code="METAL10"
          expiry="30 Jun 2026"
        />
        <DealCard 
          title="Electronic Waste Special" 
          description="Free pick-up and premium rates for old laptops and appliances."
          code="EWastePro"
          expiry="15 Jul 2026"
        />
        <DealCard 
          title="Paper & Cardboard Bulk" 
          description="Flat ₹50 bonus on bulk paper disposal over 100kg."
          code="BULKPAPER"
          expiry="20 Jun 2026"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
