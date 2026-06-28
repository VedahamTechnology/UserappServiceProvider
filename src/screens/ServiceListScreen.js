import React, { useState, useCallback } from 'react';
import { View, TextInput, ScrollView, RefreshControl } from 'react-native';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants/colors';
import { extractList, mapService } from '../utils/mappers';

import { ScreenContainer, ScreenHeader } from '../components/layout/ScreenContainer';
import ServiceCard from '../components/service/ServiceCard';
import LoadingView from '../components/feedback/LoadingView';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';

import { serviceService } from '../services/serviceService';

export default function ServiceListScreen({ route, navigation }) {
  const t = useT();
  const toast = useToast();

  const { categoryId, categoryName, searchInitial } = route.params || {};

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchInitial || '');

  const fetchServices = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const params = { limit: 20, search: searchQuery || undefined };
      const response = categoryId
        ? await serviceService.getServicesByCategory(categoryId, params)
        : await serviceService.getServices(params);
      if (response?.success) {
        // /servicesByCategory wraps results in { data: { services: [...] } }
        // while /services returns { data: [...] } directly — extractList handles both.
        setServices(extractList(response, 'services', 'data').map(mapService));
      } else {
        setServices([]);
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchQuery, t, toast]);

  // Refresh when category / search changes.
  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <ScreenHeader
        title={categoryName || t('services.allServices')}
        onBack={() => navigation.goBack()}
      />

      {/* Search Bar */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-50 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-gray-100 dark:border-slate-700">
          <TextInput
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={COLORS.placeholder}
            className="flex-1 text-gray-900 dark:text-white font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchServices()}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={fetchServices} />
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchServices(true)}
              colors={[COLORS.primary]}
            />
          }
        >
          {services.length === 0 ? (
            <EmptyState icon="info" title={t('services.noServices')} />
          ) : (
            <View className="pt-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
                />
              ))}
              <View className="h-10" />
            </View>
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}