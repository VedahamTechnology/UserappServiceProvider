import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';

export default function WelcomeScreen({ navigation }) {
  return (
     
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require('../../assets/img/welcome_bg.png')}
          style={{ width: '100%', height: 450 }}
          resizeMode="cover"
        />
        
        <View className="px-6 py-8 flex-1 justify-between">
          <View>
            <Text className="text-4xl font-bold text-gray-900 text-center">
              Welcome to HomeStr
            </Text>
            <Text className="text-center mt-3 text-lg text-gray-500 px-4 leading-6">
              Your one-stop solution for all your home needs. Professional services at your doorstep.
            </Text>
          </View>

          <View className="mt-8">
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('Login')}
              className="mb-4"
            />
            <View className="flex-row justify-center">
              <Text className="text-gray-400">Trusted by over 10k users</Text>
            </View>
          </View>
        </View>
      </ScrollView>
  );
}
