import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useT } from '../../i18n/useT';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import LoadingView from '../../components/feedback/LoadingView';

const MOCK_RATINGS = [
  {
    id: '1',
    serviceKey: 'Sofa Cleaning',
    professional: 'Rajesh Kumar',
    rating: 5.0,
    review: 'Excellent service! The sofa looks brand new now. Very professional behavior.',
    date: '10 May 2026',
  },
  {
    id: '2',
    serviceKey: 'Kitchen Cleaning',
    professional: 'Sunita Sharma',
    rating: 4.5,
    review:
      'Great attention to detail. Only missed a small corner under the sink but otherwise perfect.',
    date: '22 Apr 2026',
  },
];

const RatingCard = ({ service, professional, rating, review, date, t }) => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="flex-row justify-between items-start">
      <View className="flex-1 mr-2">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{service}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {t('myRating.withProfessional', { name: professional })}
        </Text>
      </View>
      <View className="flex-row items-center bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
        <Text className="text-green-600 font-bold mr-1">{rating.toFixed(1)}</Text>
        <Feather name="star" size={14} color={COLORS.success} fill={COLORS.success} />
      </View>
    </View>

    <Text className="text-gray-600 dark:text-gray-300 mt-3 italic">"{review}"</Text>

    <View className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-700">
      <Text className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">{date}</Text>
    </View>
  </View>
);

export default function MyRatingScreen({ navigation }) {
  const t = useT();
  const toast = useToast();
  const [ratings] = useState(MOCK_RATINGS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  if (loading) return <LoadingView />;
  if (error) return <ErrorState message={error.message} onRetry={() => setError(null)} />;

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('myRating.title')} onBack={() => navigation.goBack()} />

      <FlatList
        data={ratings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <RatingCard
            service={item.serviceKey}
            professional={item.professional}
            rating={item.rating}
            review={item.review}
            date={item.date}
            t={t}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={<EmptyState icon="star" title="No ratings yet" />}
      />
    </ScreenContainer>
  );
}