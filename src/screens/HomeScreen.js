import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { useAddress } from '../context/AddressContext';
import { COLORS } from '../constants/colors';
import { extractList, mapService } from '../utils/mappers';
import { useFocusRefresh } from '../hooks/useFocusRefresh';

import PromoSlide from '../components/service/PromoSlide';
import CategoryTile from '../components/service/CategoryTile';
import ServiceCard from '../components/service/ServiceCard';
import LoadingView from '../components/feedback/LoadingView';
import ErrorState from '../components/feedback/ErrorState';

import { categoryService } from '../services/categoryService';
import { serviceService } from '../services/serviceService';
import { notificationService } from '../services/notificationService';
import { getCurrentLocation } from '../services/locationService';

const { width } = Dimensions.get('window');

/**
 * Promo slider data. Stays in the screen because it has no backend yet — once
 * the API exposes `/promotions`, swap this for a fetched list.
 */
const SLIDER_DATA = [
  { id: '1', title: 'Home Cleaning', subtitle: 'Up to 50% Off', color: COLORS.primary, icon: 'home' },
  { id: '2', title: 'AC Service', subtitle: 'Starting at ₹499', color: '#4F46E5', icon: 'thermometer' },
  { id: '3', title: 'Plumbing Work', subtitle: 'Expert Technicians', color: '#10B981', icon: 'construct' },
];

export default function HomeScreen({ navigation }) {
  const t = useT();
  const toast = useToast();
  const { defaultAddress } = useAddress();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [catRes, servRes, unreadRes] = await Promise.all([
        categoryService.getCategories(),
        serviceService.getServices({ limit: 6 }),
        notificationService.getUnreadCount().catch(() => ({ success: false, data: { unreadCount: 0 } })),
      ]);

      if (catRes?.success) {
        setCategories(extractList(catRes, 'categories', 'data'));
      }
      if (servRes?.success) {
        setServices(extractList(servRes, 'services', 'data').map(mapService));
      }
      if (unreadRes?.success) {
        setUnreadCount(unreadRes?.data?.unreadCount || 0);
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t, toast]);

  useFocusRefresh(fetchData);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setActiveSlide(viewableItems[0].index);
  }).current;

  const renderSliderItem = ({ item }) => (
    <PromoSlide item={item} onPress={() => navigation.navigate('ServiceList')} />
  );

  const addressLabel =
    defaultAddress?.street ||
    defaultAddress?.city ||
    t('home.locationPlaceholder');

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View className="px-4 py-2 flex-row justify-between items-center">
        <Text className="text-2xl font-black text-primary tracking-tighter">
          {t('home.brand')}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          className="p-2 bg-gray-50 dark:bg-slate-800 rounded-full relative"
        >
          <Feather name="bell" size={20} color={COLORS.textSubtle} />
          {unreadCount > 0 ? (
            <View className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full items-center justify-center border-2 border-white">
              <Text className="text-[8px] text-white font-black">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Location Selector */}
      <View className="px-4 py-2 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-primary/10 p-2 rounded-full mr-3">
            <Feather name="map-pin" size={18} color={COLORS.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">
              {t('home.currentLocation')}
            </Text>
            <Text className="text-sm font-bold text-gray-900 dark:text-white" numberOfLines={1}>
              {addressLabel}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ManageAddress')}
          className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg"
        >
          <Text className="text-primary text-xs font-bold">{t('common.change')}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-700">
          <Feather name="search" size={20} color={COLORS.textSubtle} />
          <TextInput
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            className="flex-1 ml-3 text-gray-900 dark:text-white font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() =>
              navigation.navigate('ServiceList', { searchInitial: searchQuery })
            }
          />
          <TouchableOpacity className="bg-primary p-2 rounded-xl">
            <Feather name="sliders" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Promo Slider */}
        <View className="mt-2">
          <FlatList
            data={SLIDER_DATA}
            renderItem={renderSliderItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            snapToInterval={width - 32 + 16}
            decelerationRate="fast"
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
          <View className="flex-row justify-center mt-4 space-x-2">
            {SLIDER_DATA.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full ${
                  activeSlide === index ? 'w-6 bg-primary' : 'w-2 bg-gray-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View className="px-4 mt-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-black text-gray-900 dark:text-white">
              {t('home.categories')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryList')}>
              <Text className="text-primary font-bold">{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <LoadingView />
          ) : error ? (
            <ErrorState message={error.message} onRetry={() => fetchData()} />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category) => (
                <CategoryTile
                  key={category._id || category.id}
                  category={category}
                  onPress={() =>
                    navigation.navigate('ServiceList', {
                      categoryId: category._id || category.id,
                      categoryName: category.name,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Popular Services */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-black text-gray-900 dark:text-white">
              {t('home.popularServices')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ServiceList')}>
              <Text className="text-primary font-bold">{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <LoadingView />
          ) : (
            <View>
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}