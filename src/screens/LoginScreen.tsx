import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "../api/authApi";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });
      console.log("Login Success:", response);
      Alert.alert("Success", "Logged in successfully!");
      // Navigate to Home/Dashboard when available
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="mt-10">
        <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
        <Text className="text-gray-500 mt-2">Login to your account</Text>
      </View>

      <View className="mt-10">
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Email</Text>
          <TextInput
            className="border-b border-gray-300 py-2 text-lg"
            placeholder="example@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 font-semibold mb-2">Password</Text>
          <TextInput
            className="border-b border-gray-300 py-2 text-lg"
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          className="items-end"
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text className="text-blue-600 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className={`bg-blue-600 py-4 rounded-xl mt-10 flex-row justify-center items-center ${
          loading ? "opacity-70" : ""
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading && <ActivityIndicator color="white" className="mr-2" />}
        <Text className="text-white text-center text-lg font-semibold">
          Login
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-10">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text className="text-blue-600 font-bold">Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
