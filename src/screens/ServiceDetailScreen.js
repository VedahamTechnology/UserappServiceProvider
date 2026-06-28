import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants/colors';
import { mapService } from '../utils/mappers';
import { formatINR } from '../utils/currency';

import LoadingView from '../components/feedback/LoadingView';
import ErrorState from '../components/feedback/ErrorState';

import { serviceService } from '../services/serviceService';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen({ route, navigation }) {
  const t = useT();
  const toast = useToast();

  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceService.getServiceDetails(serviceId);
      if (response?.success) {
        setService(mapService(response.data || response.service || {}));
      } else {
        setError(new Error(response?.message || t('services.serviceNotFound')));
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
    }
  }, [serviceId, t, toast]);

  React.useEffect(() => {
    fetchService();
  }, [fetchService]);

  if (loading) return <LoadingView />;
  if (error)
    return (
      <ErrorState message={error.message} onRetry={fetchService} />
    );
  if (!service)
    return (
      <ErrorState message={t('services.serviceNotFound')} onRetry={() => navigation.goBack()} />
    );

  const { image, name, categoryName, estimatedDuration, description, features, basePrice, discountedPrice } = service;
  const displayPrice = discountedPrice || basePrice;
  const hasDiscount = discountedPrice > 0 && discountedPrice < basePrice;

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative">
          <Image
            source={{ uri: image || 'https://via.placeholder.com/400' }}
            style={{ width: width, height: 350 }}
            resizeMode="cover"
          />
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-black/30 rounded-full items-center justify-center">
              <Feather name="share-2" size={20} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View className="flex-1 bg-white dark:bg-slate-900 -mt-10 rounded-t-[40px] px-6 pt-8">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-primary font-black uppercase tracking-[2px] text-xs mb-2">
                {categoryName || t('services.exploreServices')}
              </Text>
              <Text className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {name}
              </Text>
            </View>
            <View className="bg-yellow-50 px-3 py-1.5 rounded-2xl flex-row items-center border border-yellow-100">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-yellow-700 font-black ml-1">{t('home.rating')}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
                <Feather name="clock" size={18} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">
                  {t('services.duration')}
                </Text>
                <Text className="text-sm font-black text-gray-900 dark:text-white">
                  {t('services.durationMins', { mins: estimatedDuration })}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mr-3">
                <Feather name="shield" size={18} color="#10B981" />
              </View>
              <View>
                <Text className="text-[10px] text-gray-400 font-bold uppercase">
                  {t('services.warranty')}
                </Text>
                <Text className="text-sm font-black text-gray-900 dark:text-white">
                  {t('services.warrantyDays')}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-xl font-black text-gray-900 dark:text-white mb-3">
              {t('services.description')}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 leading-6 text-sm">
              {description}
            </Text>
          </View>

          {features && features.length > 0 ? (
            <View className="mt-8">
              <Text className="text-xl font-black text-gray-900 dark:text-white mb-4">
                {t('services.whatsIncluded')}
              </Text>
              {features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <View className="bg-primary/10 p-1 rounded-full mr-3">
                    <Feather name="check" size={14} color={COLORS.primary} />
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 font-medium">{feature}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View className="h-32" />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 p-6 flex-row items-center justify-between">
        <View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {t('services.totalPrice')}
          </Text>
          <View className="flex-row items-baseline mt-1">
            <Text className="text-primary text-2xl font-black">{formatINR(displayPrice)}</Text>
            {hasDiscount ? (
              <Text className="text-gray-400 text-sm font-bold line-through ml-2">
                {formatINR(basePrice)}
              </Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          className="bg-primary px-10 py-4 rounded-2xl"
          onPress={() => navigation.navigate('Checkout', { service })}
        >
          <Text className="text-white font-black text-lg">{t('home.bookNow')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}