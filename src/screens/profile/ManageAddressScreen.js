import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const AddressCard = ({ type, address, isDefault }) => (
  <TouchableOpacity className={`bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border ${isDefault ? 'border-primaryPink' : 'border-gray-100 dark:border-slate-700'}`}>
    <View className="flex-row items-center justify-between mb-2">
      <View className="flex-row items-center">
        <Feather name={type === 'Home' ? 'home' : 'briefcase'} size={18} color="#FF8383" />
        <Text className="ml-2 font-bold text-gray-900 dark:text-white">{type}</Text>
        {isDefault && (
          <View className="ml-3 bg-primaryPink/10 px-2 py-0.5 rounded-md">
            <Text className="text-primaryPink text-[10px] font-bold uppercase">Default</Text>
          </View>
        )}
      </View>
      <View className="flex-row">
        <TouchableOpacity className="p-1">
          <Feather name="edit-2" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity className="p-1 ml-2">
          <Feather name="trash-2" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
    <Text className="text-gray-600 dark:text-gray-300 leading-5">{address}</Text>
  </TouchableOpacity>
);

export default function ManageAddressScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Manage Addresses</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <AddressCard 
          type="Home" 
          address="Flat 402, Sunshine Apartments, 7th Main Road, HSR Layout, Bangalore - 560102" 
          isDefault
        />
        <AddressCard 
          type="Work" 
          address="Tech Hub, Phase 2, Electronic City, Bangalore - 560100" 
        />
        
        <TouchableOpacity className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-5 mt-2">
          <Feather name="plus-circle" size={20} color="#FF8383" />
          <Text className="ml-2 font-bold text-gray-700 dark:text-gray-300">Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
