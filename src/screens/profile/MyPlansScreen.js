import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';
import { formatINR } from '../../utils/currency';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';

const PlanCard = ({ title, price, duration, features, isPopular }) => (
  <View
    className={`bg-white dark:bg-slate-800 rounded-3xl p-6 mb-6 shadow-sm border ${
      isPopular ? 'border-primary border-2' : 'border-gray-100 dark:border-slate-700'
    }`}
  >
    {isPopular && (
      <View className="absolute -top-3 left-6 bg-primary px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-bold uppercase">{'POPULAR'}</Text>
      </View>
    )}
    <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
    <View className="flex-row items-baseline mt-2">
      <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">{price}</Text>
      <Text className="text-gray-500 dark:text-gray-400 ml-1">{duration}</Text>
    </View>

    <View className="mt-6">
      {features.map((feature, index) => (
        <View key={index} className="flex-row items-center mb-3">
          <Feather name="check-circle" size={18} color={COLORS.primary} />
          <Text className="ml-3 text-gray-600 dark:text-gray-300 flex-1">{feature}</Text>
        </View>
      ))}
    </View>

    <TouchableOpacity
      className={`mt-4 py-4 rounded-2xl items-center ${
        isPopular ? 'bg-primary' : 'bg-gray-100 dark:bg-slate-700'
      }`}
    >
      <Text
        className={`font-bold text-lg ${
          isPopular ? 'text-white' : 'text-gray-700 dark:text-gray-200'
        }`}
      >
        {'CHOOSE_PLAN'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default function MyPlansScreen({ navigation }) {
  const t = useT();

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('myPlans.title')} onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <PlanCard
          title={t('myPlans.basicCare')}
          price={formatINR(499)}
          duration={t('myPlans.perMonth')}
          features={['f1', 'f2', 'f3'].map((f) => t(`myPlans.featuresBasic.${f}`))}
        />
        <PlanCard
          title={t('myPlans.premiumHome')}
          price={formatINR(999)}
          duration={t('myPlans.perMonth')}
          isPopular
          features={['f1', 'f2', 'f3', 'f4'].map((f) => t(`myPlans.featuresPremium.${f}`))}
        />
        <PlanCard
          title={t('myPlans.annualElite')}
          price={formatINR(9999)}
          duration={t('myPlans.perYear')}
          features={['f1', 'f2', 'f3', 'f4'].map((f) => t(`myPlans.featuresElite.${f}`))}
        />
      </ScrollView>
    </ScreenContainer>
  );
}