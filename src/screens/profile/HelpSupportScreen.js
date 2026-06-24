import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { primaryColor } from '../../constants/color';

const FAQItem = ({ question }) => (
  <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800">
    <Text className="text-gray-700 dark:text-gray-300 font-medium flex-1 mr-4">{question}</Text>
    <Feather name="chevron-down" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const SupportChannel = ({ icon, title, subtitle, color }) => (
  <TouchableOpacity className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
    <View className={`w-12 h-12 rounded-full items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
      <Feather name={icon} size={24} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
      <Text className="text-gray-500 dark:text-gray-400">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function HelpSupportScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Help & Support</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-primaryColor rounded-3xl p-6 mb-6">
          <Text className="text-2xl font-bold text-white mb-2">How can we help you?</Text>
          <Text className="text-white/80 text-base mb-4">Search for common issues or contact us directly.</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Search topics..." 
              className="ml-3 flex-1 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</Text>
        <SupportChannel icon="message-circle" title="Chat with us" subtitle="Our team is here to help" color="#3B82F6" />
        <SupportChannel icon="phone" title="Call Support" subtitle="Available 9 AM - 9 PM" color="#10B981" />
        <SupportChannel icon="mail" title="Email Support" subtitle="Get response in 24 hours" color="#F59E0B" />

        <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">FAQs</Text>
        <FAQItem question="How do I cancel my booking?" />
        <FAQItem question="What is your refund policy?" />
        <FAQItem question="How can I track my service provider?" />
        <FAQItem question="Is there a subscription fee?" />
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
