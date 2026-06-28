import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import ScreenContainer from '../components/layout/ScreenContainer';
import { useT } from '../i18n/useT';
import { COLORS } from '../constants/colors';

/**
 * Landing screen — first thing the user sees.
 * Translates via useT so the hero copy is localizable.
 */
export default function WelcomeScreen({ navigation }) {
  const t = useT();

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require('../../assets/img/welcome_bg.png')}
          style={{ width: '100%', height: '70%' }}
          resizeMode="cover"
        />

        <View
          className="px-6 py-8 flex-1 justify-between"
          style={{ transform: [{ translateY: -70 }] }}
        >
          <View>
            <Text className="text-4xl font-bold text-gray-900 dark:text-white text-center">
              {t('auth.welcomeTitle')}
            </Text>
            <Text className="text-center mt-3 text-lg text-gray-500 dark:text-gray-400 px-4 leading-6">
              {t('auth.welcomeSubtitle')}
            </Text>
          </View>

          <View className="mt-8">
            <Button
              title={t('auth.getStarted')}
              onPress={() => navigation.navigate('Login')}
              className="mb-4"
            />
            <View className="flex-row justify-center">
              <Text className="text-gray-400">{t('common.trustedByUsers')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}