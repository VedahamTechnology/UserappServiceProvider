import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const SectionHeader = ({ title }) => (
  <View className="px-4 py-3 bg-gray-50 dark:bg-slate-800">
    <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</Text>
  </View>
);

const SettingItem = ({ icon, title, value, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center justify-between px-4 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800"
  >
    <View className="flex-row items-center flex-1">
      <View className="w-8">
        <Feather name={icon} size={20} color="#FF8383" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">{title}</Text>
        {value && <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{value}</Text>}
      </View>
    </View>
    <Feather name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function EditProfileScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50 dark:bg-slate-800">
        <SectionHeader title="Personal Information" />
        <SettingItem icon="user" title="Full Name" value="John Doe" onPress={() => {}} />
        <SettingItem icon="mail" title="Email" value="john.doe@example.com" onPress={() => {}} />
        <SettingItem icon="phone" title="Phone" value="+91 9876543210" onPress={() => {}} />
        <SettingItem icon="gift" title="Gender" value="Male" onPress={() => {}} />
        <SettingItem icon="calendar" title="Date of Birth" value="01 Jan 1995" onPress={() => {}} />

        <SectionHeader title="Security" />
        <SettingItem icon="lock" title="Change Password" onPress={() => {}} />
        <SettingItem icon="shield" title="Two-Factor Authentication" onPress={() => {}} />
        
        <View className="p-4 mt-4">
          <TouchableOpacity className="bg-primaryPink py-4 rounded-xl items-center">
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
