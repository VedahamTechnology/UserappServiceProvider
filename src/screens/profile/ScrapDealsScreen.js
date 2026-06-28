import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';

const DEALS = [
  {
    id: 'd1',
    title: 'Metal Scrap Bonus',
    description: 'Get extra 10% value on all metal scrap collections above 50kg.',
    code: 'METAL10',
    expiry: '30 Jun 2026',
  },
  {
    id: 'd2',
    title: 'Electronic Waste Special',
    description: 'Free pick-up and premium rates for old laptops and appliances.',
    code: 'EWastePro',
    expiry: '15 Jul 2026',
  },
  {
    id: 'd3',
    title: 'Paper & Cardboard Bulk',
    description: 'Flat ₹50 bonus on bulk paper disposal over 100kg.',
    code: 'BULKPAPER',
    expiry: '20 Jun 2026',
  },
];

const DealCard = ({ title, description, code, expiry, t }) => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-slate-700">
    <View className="flex-row justify-between items-start">
      <View className="flex-1 mr-2">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">{description}</Text>
      </View>
      <View className="bg-primary/10 px-3 py-1 rounded-full">
        <Text className="text-primary font-bold text-xs">{t('scrapDeals.dealBadge')}</Text>
      </View>
    </View>

    <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
      <View>
        <Text className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">
          {t('scrapDeals.useCode')}
        </Text>
        <Text className="text-primary font-bold text-lg tracking-widest">{code}</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">
          {t('scrapDeals.expires')}
        </Text>
        <Text className="text-gray-700 dark:text-gray-300 font-semibold">{expiry}</Text>
      </View>
    </View>
  </View>
);

export default function ScrapDealsScreen({ navigation }) {
  const t = useT();

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('scrapDeals.title')} onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {DEALS.map((deal) => (
          <DealCard
            key={deal.id}
            title={deal.title}
            description={deal.description}
            code={deal.code}
            expiry={deal.expiry}
            t={t}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}