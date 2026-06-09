import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    // Simulate API call
    Alert.alert("Success", "Password reset link sent to your email", [
      { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="mt-10">
        <Text className="text-3xl font-bold text-gray-800">Forgot Password?</Text>
        <Text className="text-gray-500 mt-2">
          Enter your email address to receive a password reset link.
        </Text>
      </View>

      <View className="mt-8">
        <TextInput
          className="border-b border-gray-300 py-3 text-lg"
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl mt-10"
        onPress={handleResetPassword}
      >
        <Text className="text-white text-center text-lg font-semibold">
          Send Reset Link
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-blue-600 text-center text-base">
          Back to Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
