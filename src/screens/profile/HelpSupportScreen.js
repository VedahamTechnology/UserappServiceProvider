import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import SectionCard from '../../components/profile/SectionCard';
import FAQItem from '../../components/profile/FAQItem';

const SupportChannel = ({ icon, title, subtitle, color }) => (
  <TouchableOpacity className="flex-row items-center bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 dark:border-slate-700">
    <View
      className="w-12 h-12 rounded-full items-center justify-center"
      style={{ backgroundColor: `${color}15` }}
    >
      <Feather name={icon} size={24} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-lg font-bold text-gray-900 dark:text-white">{title}</Text>
      <Text className="text-gray-500 dark:text-gray-400">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default function HelpSupportScreen({ navigation }) {
  const t = useT();

  const faqs = [
    'faqCancelBooking',
    'faqRefundPolicy',
    'faqTrackProvider',
    'faqSubscription',
  ].map((key) => t(`helpSupport.${key}`));

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('helpSupport.title')} onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-primary rounded-3xl p-6 mb-6">
          <Text className="text-2xl font-bold text-white mb-2">{t('helpSupport.heroTitle')}</Text>
          <Text className="text-white/80 text-base mb-4">{t('helpSupport.heroSubtitle')}</Text>
          <View className="flex-row items-center bg-white rounded-xl px-4 py-3">
            <Feather name="search" size={20} color={COLORS.textSubtle} />
            <TextInput
              placeholder={t('helpSupport.searchPlaceholder')}
              className="ml-3 flex-1 text-gray-800"
              placeholderTextColor={COLORS.textSubtle}
            />
          </View>
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {t('helpSupport.contactUs')}
        </Text>
        <SupportChannel
          icon="message-circle"
          title={t('helpSupport.contactChat')}
          subtitle={t('helpSupport.contactChatSub')}
          color={COLORS.info}
        />
        <SupportChannel
          icon="phone"
          title={t('helpSupport.contactCall')}
          subtitle={t('helpSupport.contactCallSub')}
          color={COLORS.success}
        />
        <SupportChannel
          icon="mail"
          title={t('helpSupport.contactEmail')}
          subtitle={t('helpSupport.contactEmailSub')}
          color={COLORS.warning}
        />

        <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
          {t('helpSupport.faqs')}
        </Text>
        <SectionCard className="px-4">
          {faqs.map((q, idx) => (
            <FAQItem key={idx} question={q} />
          ))}
        </SectionCard>

        <View className="h-10" />
      </ScrollView>
    </ScreenContainer>
  );
}