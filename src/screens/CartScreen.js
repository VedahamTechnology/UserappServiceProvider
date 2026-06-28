import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useT } from '../i18n/useT';
import EmptyState from '../components/feedback/EmptyState';

export default function CartScreen({ navigation }) {
  const t = useT();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <EmptyState
        icon="shopping-cart"
        title={t('cart.empty')}
        subtitle={t('cart.emptyHint')}
        ctaLabel={t('cart.exploreCta')}
        onCtaPress={() => navigation.navigate('Home')}
      />
    </SafeAreaView>
  );
}