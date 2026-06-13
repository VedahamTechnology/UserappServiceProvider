import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <View>
        <Text className="text-3xl font-bold text-gray-900">
          Welcome to HomeStr!
        </Text>
      </View>
    </SafeAreaView>
  );
}
