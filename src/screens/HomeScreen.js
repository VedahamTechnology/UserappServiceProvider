import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center">
      <View>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to HomeStr!
        </Text>
      </View>
    </SafeAreaView>
  );
}
