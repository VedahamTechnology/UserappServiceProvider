import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Button from '../components/common/Button';

const CartItem = ({ item, onRemove }) => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 flex-row items-center shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="w-20 h-20 bg-primaryPink/10 rounded-xl items-center justify-center">
      <Feather name="tool" size={32} color="#FF8383" />
    </View>
    
    <View className="flex-1 ml-4">
      <View className="flex-row justify-between items-start">
        <Text className="text-lg font-bold text-gray-900 dark:text-white flex-1">{item.name}</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.category}</Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-primaryPink font-extrabold text-lg">₹{item.price}</Text>
        <View className="flex-row items-center bg-gray-50 dark:bg-slate-700 rounded-lg px-2 py-1">
          <TouchableOpacity className="p-1">
            <Feather name="minus" size={14} color="#FF8383" />
          </TouchableOpacity>
          <Text className="mx-3 font-bold dark:text-white">1</Text>
          <TouchableOpacity className="p-1">
            <Feather name="plus" size={14} color="#FF8383" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const BillRow = ({ label, value, isTotal }) => (
  <View className={`flex-row justify-between mb-2 ${isTotal ? 'mt-4 pt-4 border-t border-gray-100 dark:border-slate-700' : ''}`}>
    <Text className={`${isTotal ? 'text-lg font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
      {label}
    </Text>
    <Text className={`${isTotal ? 'text-xl font-extrabold text-primaryPink' : 'text-gray-700 dark:text-gray-200 font-semibold'}`}>
      {value}
    </Text>
  </View>
);

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'AC Deep Cleaning', category: 'Appliances', price: 599 },
    { id: 2, name: 'Bathroom Cleaning', category: 'Cleaning', price: 899 },
  ]);

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const totalAmount = calculateTotal();
  const serviceFee = totalAmount > 0 ? 49 : 0;
  const tax = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + serviceFee + tax;

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-8">
        <View className="w-24 h-24 bg-primaryPink/10 rounded-full items-center justify-center mb-6">
          <Feather name="shopping-cart" size={48} color="#FF8383" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">Your cart is empty</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8 text-base">
          Looks like you haven't added any services yet.
        </Text>
        <Button 
          title="Browse Services" 
          onPress={() => navigation.navigate('Home')}
          className="w-full"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
          My Cart
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View className="mb-6">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={removeItem} />
          ))}
        </View>

        {/* Promo Code */}
        <TouchableOpacity className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 flex-row items-center justify-between shadow-sm border border-dashed border-primaryPink/50">
          <View className="flex-row items-center">
            <Feather name="tag" size={20} color="#FF8383" />
            <Text className="ml-3 font-bold text-gray-700 dark:text-gray-300">Apply Promo Code</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Bill Summary */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-10 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bill Summary</Text>
          <BillRow label="Item Total" value={`₹${totalAmount}`} />
          <BillRow label="Service Fee" value={`₹${serviceFee}`} />
          <BillRow label="Taxes & Charges (18%)" value={`₹${tax}`} />
          <BillRow label="Total Amount" value={`₹${grandTotal}`} isTotal />
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <Button 
          title="Proceed to Checkout" 
          onPress={() => {}} 
        />
      </View>
    </SafeAreaView>
  );
}
