import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../components/common/Button';

const ScrapCategory = ({ icon, title, rate, unit, color }) => (
  <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-3xl p-5 mb-4 flex-row items-center shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Feather name={icon} size={28} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
      <View className="flex-row items-baseline mt-1">
        <Text className="text-primaryPink font-extrabold text-xl">₹{rate}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">/{unit}</Text>
      </View>
    </View>
    <TouchableOpacity className="bg-primaryPink/10 p-2 rounded-xl">
      <Feather name="plus" size={20} color="#FF8383" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function ScrapScreen() {
  const categories = [
    { icon: 'package', title: 'Paper & Cardboard', rate: '12', unit: 'kg', color: '#3B82F6' },
    { icon: 'trash-2', title: 'Plastic Waste', rate: '18', unit: 'kg', color: '#10B981' },
    { icon: 'cpu', title: 'Electronic Waste', rate: '45', unit: 'kg', color: '#8B5CF6' },
    { icon: 'anchor', title: 'Iron & Steel', rate: '28', unit: 'kg', color: '#6B7280' },
    { icon: 'wind', title: 'Aluminum', rate: '95', unit: 'kg', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Scrap Pickup
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">Sell your scrap and help the planet</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View className="bg-primaryPink rounded-3xl p-6 mb-6 flex-row items-center">
          <View className="flex-1 pr-4">
            <Text className="text-white text-xl font-bold mb-1">Earn from Waste!</Text>
            <Text className="text-white/80 text-sm">Best market rates for your household scrap with free doorstep pickup.</Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            <Feather name="trending-up" size={32} color="white" />
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Market Rates</Text>
        
        {categories.map((cat, index) => (
          <ScrapCategory key={index} {...cat} />
        ))}

        <View className="h-10" />
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <Button 
          title="Schedule a Pickup" 
          onPress={() => {}} 
        />
      </View>
    </SafeAreaView>
  );
}
