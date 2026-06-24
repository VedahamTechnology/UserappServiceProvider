import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';

const PlanCard = ({ title, price, duration, features, isPopular }) => (
  <View className={`bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border ${isPopular ? 'border-primaryColor border-2' : 'border-gray-100 dark:border-slate-700'}`}>
    {isPopular && (
      <View className="absolute -top-3 left-6 bg-primaryColor px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-bold uppercase">Most Popular</Text>
      </View>
    )}
    <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
    <View className="flex-row items-baseline mt-2">
      <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{price}</Text>
      <Text className="text-gray-500 dark:text-gray-400 ml-1">/{duration}</Text>
    </View>
    
    <View className="mt-6 space-y-4">
      {features.map((feature, index) => (
        <View key={index} className="flex-row items-center">
          <Feather name="check-circle" size={18} color={primaryColor} />
          <Text className="ml-3 text-gray-600 dark:text-gray-300">{feature}</Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity className={`mt-8 py-4 rounded-2xl items-center ${isPopular ? 'bg-primaryColor' : 'bg-gray-100 dark:bg-slate-700'}`}>
      <Text className={`font-bold text-lg ${isPopular ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
        Choose Plan
      </Text>
    </TouchableOpacity>
  </View>
);

export default function MyPlansScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Service Plans</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <PlanCard 
          title="Basic Care"
          price="499"
          duration="month"
          features={["2 Professional cleanings", "Priority scheduling", "10% off spare parts"]}
        />
        <PlanCard 
          title="Premium Home"
          price="999"
          duration="month"
          isPopular
          features={["5 Professional cleanings", "Emergency call-outs", "20% off all services", "Dedicated support"]}
        />
        <PlanCard 
          title="Annual Elite"
          price="9999"
          duration="year"
          features={["Unlimited cleanings", "Free spare parts up to ₹5000", "Free inspection every month", "VIP access"]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
