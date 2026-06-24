import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { serviceService } from '../services/serviceService';
import { primaryColor } from '../constants/color';

export default function ServiceListScreen({ route, navigation }) {
  const { categoryId, categoryName, searchInitial } = route.params || {};
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchInitial || '');

  const fetchServices = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {
        limit: 20,
        search: searchQuery
      };
      
      let response;
      if (categoryId) {
        response = await serviceService.getServicesByCategory(categoryId, params);
        // Note: Response structure for getServicesByCategory is { data: { services: [...] } } based on API doc
        if (response.success) {
          setServices(response.data.services || []);
        }
      } else {
        response = await serviceService.getServices(params);
        if (response.success) {
          setServices(response.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId, searchQuery]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white flex-1" numberOfLines={1}>
          {categoryName || 'All Services'}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-700">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search for services..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 dark:text-white font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchServices()}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchServices(true)} colors={[primaryColor]} />
          }
        >
          {services.length === 0 ? (
            <View className="py-20 items-center">
              <Feather name="info" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 font-bold">No services found</Text>
            </View>
          ) : (
            <View className="space-y-4 pt-2">
              {services.map((service) => (
                <TouchableOpacity 
                  key={service._id}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-4 flex-row border border-gray-100 dark:border-slate-700 shadow-sm mb-4"
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
                >
                  <Image 
                    source={{ uri: service.image || 'https://via.placeholder.com/150' }} 
                    className="w-24 h-24 rounded-2xl"
                  />
                  <View className="flex-1 ml-4 justify-between py-1">
                    <View>
                      <View className="flex-row justify-between items-start">
                        <Text className="text-[10px] font-black text-primaryColor uppercase tracking-widest mb-1">
                          {service.category?.name || categoryName || 'Service'}
                        </Text>
                        <View className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-lg">
                          <Ionicons name="star" size={10} color="#F59E0B" />
                          <Text className="text-[10px] font-black text-yellow-700 ml-1">4.5</Text>
                        </View>
                      </View>
                      <Text className="text-base font-black text-gray-900 dark:text-white" numberOfLines={1}>
                        {service.name}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
                        {service.description}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mt-2">
                      <View className="flex-row items-baseline">
                        <Text className="text-primaryColor font-black text-lg">₹{service.discountedPrice || service.basePrice}</Text>
                        {service.discountedPrice > 0 && service.discountedPrice < service.basePrice && (
                          <Text className="text-gray-400 text-[10px] font-bold line-through ml-2">₹{service.basePrice}</Text>
                        )}
                      </View>
                      <View className="bg-primaryColor/10 px-3 py-1.5 rounded-xl">
                        <Text className="text-primaryColor text-[10px] font-black">Book Now</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
