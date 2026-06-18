import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { categoryService } from '../services/categoryService';
import { serviceService } from '../services/serviceService';
import { notificationService } from '../services/notificationService';

const { width } = Dimensions.get('window');

const SLIDER_DATA = [
  {
    id: '1',
    title: 'Home Cleaning',
    subtitle: 'Up to 50% Off',
    color: '#FF8383',
    icon: 'home'
  },
  {
    id: '2',
    title: 'AC Service',
    subtitle: 'Starting at ₹499',
    color: '#4F46E5',
    icon: 'thermometer'
  },
  {
    id: '3',
    title: 'Plumbing Work',
    subtitle: 'Expert Technicians',
    color: '#10B981',
    icon: 'construct'
  }
];

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState('New Delhi, India');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index);
    }
  }).current;

  const fetchData = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const [catResponse, servResponse, unreadResponse] = await Promise.all([
        categoryService.getCategories(),
        serviceService.getServices({ limit: 6 }),
        notificationService.getUnreadCount()
      ]);

      if (catResponse.success) {
        setCategories(catResponse.data || []);
      }
      if (servResponse.success) {
        setServices(servResponse.data || []);
      }
      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const renderSliderItem = ({ item }) => (
    <View style={{ width: width - 32 }} className="mr-4">
      <TouchableOpacity 
        activeOpacity={0.9}
        style={{ backgroundColor: item.color }}
        className="h-44 rounded-3xl p-6 justify-between shadow-lg overflow-hidden"
      >
        <View className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <View className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-black/5" />
        
        <View>
          <Text className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Special Offer</Text>
          <Text className="text-white text-3xl font-black mt-1">{item.title}</Text>
          <Text className="text-white/90 text-lg font-bold">{item.subtitle}</Text>
        </View>

        <View className="bg-white px-5 py-2 rounded-xl self-start">
          <Text style={{ color: item.color }} className="font-bold text-sm">Book Now</Text>
        </View>

        <View className="absolute right-6 bottom-6">
          <Ionicons name={item.icon} size={60} color="rgba(255,255,255,0.2)" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Header: Brand & Notification */}
      <View className="px-4 py-2 flex-row justify-between items-center">
        <Text className="text-2xl font-black text-primaryPink tracking-tighter">
          HomeStr
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notifications')}
          className="p-2 bg-gray-50 dark:bg-slate-800 rounded-full relative"
        >
          <Feather name="bell" size={20} color="#6B7280" />
          {unreadCount > 0 && (
            <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-primaryPink rounded-full items-center justify-center border-2 border-white">
              <Text className="text-[8px] text-white font-black">{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Selector */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-primaryPink/10 p-2 rounded-full mr-3">
            <Ionicons name="location" size={18} color="#FF8383" />
          </View>
          <View>
            <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">
              Current Location
            </Text>
            <Text className="text-sm font-bold text-gray-900 dark:text-white" numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ManageAddress')}
          className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg"
        >
          <Text className="text-primaryPink text-xs font-bold">Change</Text>
        </TouchableOpacity>
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
            onSubmitEditing={() => navigation.navigate('ServiceList', { searchInitial: searchQuery })}
          />
          <TouchableOpacity className="bg-primaryPink p-2 rounded-xl">
            <Feather name="sliders" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF8383']} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Promo Slider */}
        <View className="mt-2">
          <FlatList
            data={SLIDER_DATA}
            renderItem={renderSliderItem}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            snapToInterval={width - 32 + 16}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center mt-4 space-x-2">
            {SLIDER_DATA.map((_, index) => (
              <View 
                key={index}
                className={`h-1.5 rounded-full ${activeSlide === index ? 'w-6 bg-primaryPink' : 'w-2 bg-gray-200 dark:bg-slate-700'}`}
              />
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View className="px-4 mt-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-black text-gray-900 dark:text-white">Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryList')}>
              <Text className="text-primaryPink font-bold">See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading && !refreshing ? (
            <View className="py-10">
              <ActivityIndicator size="large" color="#FF8383" />
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category._id}
                  className="w-[23%] items-center mb-6"
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ServiceList', { categoryId: category._id, categoryName: category.name })}
                >
                  <View className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl items-center justify-center mb-2 border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <Image 
                      source={{ 
                        uri: category.image && category.image.startsWith('http') 
                          ? category.image 
                          : 'https://cdn-icons-png.flaticon.com/512/10473/10473663.png' // Professional service placeholder
                      }} 
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                  <Text 
                    className="text-[11px] font-bold text-gray-700 dark:text-gray-300 text-center"
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Popular Services Section */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-black text-gray-900 dark:text-white">Popular Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceList')}>
              <Text className="text-primaryPink font-bold">View All</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <View className="py-10">
              <ActivityIndicator size="large" color="#FF8383" />
            </View>
          ) : (
            <View className="space-y-4">
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
                        <Text className="text-[10px] font-black text-primaryPink uppercase tracking-widest mb-1">
                          {service.category?.name || 'Service'}
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
                        <Text className="text-primaryPink font-black text-lg">₹{service.discountedPrice || service.basePrice}</Text>
                        {service.discountedPrice > 0 && service.discountedPrice < service.basePrice && (
                          <Text className="text-gray-400 text-[10px] font-bold line-through ml-2">₹{service.basePrice}</Text>
                        )}
                      </View>
                      <View className="bg-primaryPink/10 px-3 py-1.5 rounded-xl">
                        <Text className="text-primaryPink text-[10px] font-black">Book Now</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}