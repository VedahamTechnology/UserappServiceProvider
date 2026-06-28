import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants/colors';
import { extractList } from '../utils/mappers';
import { useFocusRefresh } from '../hooks/useFocusRefresh';

import { ScreenContainer, ScreenHeader } from '../components/layout/ScreenContainer';
import CategoryTile from '../components/service/CategoryTile';
import LoadingView from '../components/feedback/LoadingView';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';

import { categoryService } from '../services/categoryService';

export default function CategoryListScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories();
      if (response?.success) {
        setCategories(extractList(response, 'categories', 'data'));
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
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('services.allCategories')} onBack={() => navigation.goBack()} />

      {loading && !refreshing ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={fetchCategories} />
      ) : categories.length === 0 ? (
        <EmptyState icon="grid" title={t('services.noServices')} />
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCategories(true)}
              colors={[COLORS.primary]}
            />
          }
        >
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
          <View className="h-10" />
        </ScrollView>
      )}
    </ScreenContainer>
  );
}