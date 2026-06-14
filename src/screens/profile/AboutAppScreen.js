import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const InfoRow = ({ label, value }) => (
  <View className="flex-row justify-between py-4 border-b border-gray-100 dark:border-slate-800">
    <Text className="text-gray-500 dark:text-gray-400 font-medium">{label}</Text>
    <Text className="text-gray-900 dark:text-gray-200 font-bold">{value}</Text>
  </View>
);

export default function AboutAppScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">About App</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-10">
          <View className="w-24 h-24 bg-primaryPink/10 rounded-3xl items-center justify-center mb-4">
            <Feather name="home" size={48} color="#FF8383" />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">HomeStr</Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">Version 1.0.0 (Build 42)</Text>
        </View>

        <Text className="text-gray-600 dark:text-gray-300 text-base leading-6 mb-8 text-center px-4">
          HomeStr is your all-in-one platform for professional home services and responsible scrap management. 
          We connect you with trusted experts to keep your home beautiful and the planet green.
        </Text>

        <View className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-4">
          <InfoRow label="App Name" value="HomeStr User" />
          <InfoRow label="Release Date" value="14 June 2026" />
          <InfoRow label="Developer" value="HomeStr Tech" />
          <InfoRow label="License" value="Standard" />
          <TouchableOpacity className="py-4 border-b border-gray-100 dark:border-slate-800">
            <Text className="text-primaryPink font-bold">Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-4">
            <Text className="text-primaryPink font-bold">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-10 mb-10">
          <Text className="text-gray-400 dark:text-gray-500 text-sm italic">Made with ❤️ for a better home.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
