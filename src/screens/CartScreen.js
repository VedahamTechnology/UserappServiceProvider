import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CartScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['bottom']}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-900 dark:text-white text-lg">Coming Soon</Text>
      </View>
    </SafeAreaView>
  )
}