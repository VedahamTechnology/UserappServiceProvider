import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScrapScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">Scrap</Text>
    </SafeAreaView>
  );
}
