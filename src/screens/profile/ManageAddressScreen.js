import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const AddressCard = ({ type, address, isSelected, onSelect, onRemove }) => (
  <TouchableOpacity 
    onPress={onSelect}
    className={`bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border-2 ${isSelected ? 'border-primaryPink' : 'border-transparent'}`}
  >
    <View className="flex-row items-center justify-between mb-2">
      <View className="flex-row items-center">
        <Feather name={type === 'Home' ? 'home' : type === 'Work' ? 'briefcase' : 'map-pin'} size={18} color="#FF8383" />
        <Text className="ml-2 font-bold text-gray-900 dark:text-white">{type}</Text>
        {isSelected && (
          <View className="ml-3 bg-primaryPink/10 px-2 py-0.5 rounded-md">
            <Text className="text-primaryPink text-[10px] font-bold uppercase">Selected</Text>
          </View>
        )}
      </View>
      <View className="flex-row">
        <TouchableOpacity className="p-1" onPress={() => onRemove()}>
          <Feather name="trash-2" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
    <Text className="text-gray-600 dark:text-gray-300 leading-5">{address}</Text>
  </TouchableOpacity>
);

export default function ManageAddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: 'Flat 402, Sunshine Apartments, 7th Main Road, HSR Layout, Bangalore - 560102', isSelected: true },
    { id: 2, type: 'Work', address: 'Tech Hub, Phase 2, Electronic City, Bangalore - 560100', isSelected: false },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newType, setNewType] = useState('Home');
  const [newAddress, setNewAddress] = useState('');

  const handleSelect = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isSelected: addr.id === id
    })));
    // In a real app, you would save this to storage or global state
    Alert.alert('Success', 'Address selected successfully');
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }
    const newAddr = {
      id: Date.now(),
      type: newType,
      address: newAddress,
      isSelected: false
    };
    setAddresses([...addresses, newAddr]);
    setNewAddress('');
    setModalVisible(false);
  };

  const handleRemove = (id) => {
    if (addresses.length === 1) {
      Alert.alert('Error', 'At least one address is required');
      return;
    }
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FF8383" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">Manage Addresses</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {addresses.map((item) => (
          <AddressCard 
            key={item.id}
            type={item.type}
            address={item.address}
            isSelected={item.isSelected}
            onSelect={() => handleSelect(item.id)}
            onRemove={() => handleRemove(item.id)}
          />
        ))}
        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-5 mt-2"
        >
          <Feather name="plus-circle" size={20} color="#FF8383" />
          <Text className="ml-2 font-bold text-gray-700 dark:text-gray-300">Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">Add New Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address Type</Text>
            <View className="flex-row space-x-3 mb-6">
              {['Home', 'Work', 'Other'].map((t) => (
                <TouchableOpacity 
                  key={t}
                  onPress={() => setNewType(t)}
                  className={`px-6 py-2 rounded-full border ${newType === t ? 'bg-primaryPink border-primaryPink' : 'border-gray-200 dark:border-slate-700'}`}
                >
                  <Text className={`font-bold ${newType === t ? 'text-white' : 'text-gray-500'}`}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Address</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Enter your full address here..."
              placeholderTextColor="#9CA3AF"
              value={newAddress}
              onChangeText={setNewAddress}
              className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 mb-8"
              style={{ textAlignVertical: 'top' }}
            />

            <TouchableOpacity 
              onPress={handleAddAddress}
              className="bg-primaryPink py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold text-lg">Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
