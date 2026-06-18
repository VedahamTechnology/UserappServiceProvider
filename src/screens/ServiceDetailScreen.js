import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { serviceService } from '../services/serviceService';
import Button from '../components/common/Button';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen({ route, navigation }) {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchServiceDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await serviceService.getServiceDetails(serviceId);
      if (response.success) {
        setService(response.data);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#FF8383" />
      </View>
    );
  }

  if (!service) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <Text className="text-gray-500 font-bold">Service not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-primaryPink font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image 
            source={{ uri: service.image || 'https://via.placeholder.com/400' }} 
            style={{ width: width, height: 350 }}
            resizeMode="cover"
          />
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-2">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md"
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center backdrop-blur-md"
            >
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View className="flex-1 bg-white dark:bg-slate-900 -mt-10 rounded-t-[40px] px-6 pt-8">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-primaryPink font-black uppercase tracking-[2px] text-xs mb-2">
                {service.category?.name || 'Service'}
              </Text>
              <Text className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {service.name}
              </Text>
            </View>
            <View className="bg-yellow-50 px-3 py-1.5 rounded-2xl flex-row items-center border border-yellow-100">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-yellow-700 font-black ml-1">4.5</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
                <Feather name="clock" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">Duration</Text>
                <Text className="text-sm font-black text-gray-900 dark:text-white">{service.estimatedDuration} mins</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                <Feather name="shield" size={18} color="#10B981" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">Warranty</Text>
                <Text className="text-sm font-black text-gray-900 dark:text-white">30 Days</Text>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-xl font-black text-gray-900 dark:text-white mb-3">Description</Text>
            <Text className="text-gray-500 dark:text-gray-400 leading-6 text-sm">
              {service.description}
            </Text>
          </View>

          {service.features && service.features.length > 0 && (
            <View className="mt-8">
              <Text className="text-xl font-black text-gray-900 dark:text-white mb-4">What's Included</Text>
              {service.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <View className="bg-primaryPink/10 p-1 rounded-full mr-3">
                    <Feather name="check" size={14} color="#FF8383" />
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 font-medium">{feature}</Text>
                </View>
              ))}
            </View>
          )}

          <View className="h-32" />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 p-6 flex-row items-center justify-between">
        <View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Price</Text>
          <View className="flex-row items-baseline mt-1">
            <Text className="text-primaryPink text-2xl font-black">₹{service.discountedPrice || service.basePrice}</Text>
            {service.discountedPrice > 0 && (
              <Text className="text-gray-400 text-sm font-bold line-through ml-2">₹{service.basePrice}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity 
          className="bg-primaryPink px-10 py-4 rounded-2xl shadow-lg shadow-primaryPink/30"
          onPress={() => navigation.navigate('Checkout', { service })}
        >
          <Text className="text-white font-black text-lg">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
