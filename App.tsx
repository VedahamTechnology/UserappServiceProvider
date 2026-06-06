import React from 'react';
import { Text, View, SafeAreaView, StatusBar } from 'react-native';

function App() {
  return (
    <SafeAreaView className="flex-1 bg-slate-100 dark:bg-slate-900 items-center justify-center">
      <StatusBar barStyle="dark-content" />
      <View className="bg-blue-600 p-6 rounded-2xl shadow-lg">
        <Text className="text-white text-3xl font-extrabold text-center">
          HomeStr User
        </Text>
        <Text className="text-blue-100 text-lg mt-2 text-center">
          NativeWind Powered
        </Text>
      </View>
      <View className="mt-8 px-6">
        <Text className="text-slate-600 dark:text-slate-400 text-center leading-6">
          Your React Native project with Tailwind CSS is ready to go!
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
