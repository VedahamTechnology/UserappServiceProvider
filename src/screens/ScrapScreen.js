import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants/colors';
import { extractList } from '../utils/mappers';
import { useFocusRefresh } from '../hooks/useFocusRefresh';

import CategoryTile from '../components/service/CategoryTile';
import LoadingView from '../components/feedback/LoadingView';
import ErrorState from '../components/feedback/ErrorState';

import { categoryService } from '../services/categoryService';

const WHY_US = [
  { id: 'fair', icon: 'tag', key: 'whyFairPrice' },
  { id: 'eco', icon: 'globe', key: 'whyEcoFriendly' },
  { id: 'door', icon: 'truck', key: 'whyDoorstep' },
  { id: 'pay', icon: 'zap', key: 'whyInstant' },
];

export default function ScrapScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await categoryService.getCategories();
      if (res?.success) {
        setCategories(extractList(res, 'categories', 'data'));
      } else {
        setCategories([]);
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t, toast]);

  useFocusRefresh(fetchCategories);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchCategories(true)}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Hero */}
        <View className="bg-primary rounded-b-3xl px-6 pt-6 pb-8">
          <Text className="text-3xl font-black text-white">{t('scrap.title')}</Text>
          <Text className="text-white/80 mt-2 text-base">{t('scrap.subtitle')}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ServiceList')}
            className="mt-5 self-start bg-white px-5 py-3 rounded-2xl flex-row items-center"
          >
            <Feather name="calendar" size={16} color={COLORS.primary} />
            <Text className="ml-2 text-primary font-bold">
              {t('scrap.schedulePickup')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="px-4 mt-6">
          <Text className="text-xl font-black text-gray-900 dark:text-white mb-4">
            {t('scrap.categoriesTitle')}
          </Text>
          {loading && !refreshing ? (
            <LoadingView />
          ) : error ? (
            <ErrorState message={error.message} onRetry={() => fetchCategories()} />
          ) : categories.length === 0 ? (
            <Text className="text-gray-500 dark:text-gray-400 py-10 text-center">
              {t('services.noServices')}
            </Text>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category) => (
                <CategoryTile
                  key={category._id || category.id}
                  category={category}
                  size="large"
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

        {/* Why Us */}
        <View className="px-4 mt-4">
          <Text className="text-xl font-black text-gray-900 dark:text-white mb-4">
            {t('scrap.whyChooseUs')}
          </Text>
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700">
            {WHY_US.map((item, idx) => (
              <View
                key={item.id}
                className={`flex-row items-center py-3 ${
                  idx !== WHY_US.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''
                }`}
              >
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <Feather name={item.icon} size={18} color={COLORS.primary} />
                </View>
                <Text className="ml-3 text-gray-700 dark:text-gray-200 font-medium flex-1">
                  {t(`scrap.${item.key}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}