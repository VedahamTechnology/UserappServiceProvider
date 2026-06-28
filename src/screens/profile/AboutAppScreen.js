import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import SectionCard from '../../components/profile/SectionCard';
import InfoRow from '../../components/profile/InfoRow';

export default function AboutAppScreen({ navigation }) {
  const t = useT();

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('about.title')} onBack={() => navigation.goBack()} />

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary/10 rounded-3xl items-center justify-center mb-4">
            <Feather name="home" size={48} color={COLORS.primary} />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('home.brand')}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">
            {t('about.version', { version: '1.0.0', build: '42' })}
          </Text>
        </View>

        <Text className="text-gray-600 dark:text-gray-300 text-base leading-6 mb-8 text-center px-4">
          {t('about.tagline')}
        </Text>

        <SectionCard className="p-4">
          <InfoRow label={t('about.rowAppName')} value={t('about.rowAppNameValue')} />
          <InfoRow label={t('about.rowReleaseDate')} value={t('about.rowReleaseDateValue')} />
          <InfoRow label={t('about.rowDeveloper')} value={t('about.rowDeveloperValue')} />
          <InfoRow label={t('about.rowLicense')} value={t('about.rowLicenseValue')} isLast />
          <TouchableOpacity className="py-4 border-b border-gray-100 dark:border-slate-700">
            <Text className="text-primary font-bold">{t('about.terms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-4">
            <Text className="text-primary font-bold">{t('about.privacy')}</Text>
          </TouchableOpacity>
        </SectionCard>

        <View className="items-center mt-10 mb-10">
          <Text className="text-gray-400 dark:text-gray-500 text-sm italic">{t('about.madeWith')}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}