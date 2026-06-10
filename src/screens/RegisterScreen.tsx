import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerCustomer } from "../api/authApi";

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { firstName, lastName, email, phone, password, gender } = formData;
    if (!firstName || !lastName || !email || !phone || !password || !gender) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await registerCustomer(formData);
      console.log("Registration Success:", response);
      Alert.alert("Success", "Account created successfully!", [
        { text: "Login Now", onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-gray-500 mt-2">Sign up to get started</Text>
        </View>

        <View className="mt-10">
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">First Name</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-lg"
              placeholder="John"
              value={formData.firstName}
              onChangeText={(text) => updateFormData("firstName", text)}
            />
          </View>
           <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Last Name</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-lg"
              placeholder="Doe"
              value={formData.lastName}
              onChangeText={(text) => updateFormData("lastName", text)}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-lg"
              placeholder="example@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Phone Number</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-lg"
              placeholder="+1 234 567 890"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">Password</Text>
            <TextInput
              className="border-b border-gray-300 py-2 text-lg"
              placeholder="********"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
            />
          </View>
          <View className="mb-6">
  <Text className="text-gray-700 font-semibold mb-3">
    Gender
  </Text>

  <View className="flex-row">
    <TouchableOpacity
      className="flex-row items-center mr-8"
      onPress={() => updateFormData("gender", "male")}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor:
            formData.gender === "male" ? "#2563eb" : "#9ca3af",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        {formData.gender === "male" && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#2563eb",
            }}
          />
        )}
      </View>

      <Text>Male</Text>
    </TouchableOpacity>

    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => updateFormData("gender", "female")}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor:
            formData.gender === "female" ? "#2563eb" : "#9ca3af",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8,
        }}
      >
        {formData.gender === "female" && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#2563eb",
            }}
          />
        )}
      </View>

      <Text>Female</Text>
    </TouchableOpacity>
  </View>
</View>
        </View>

        <TouchableOpacity
          className={`bg-blue-600 py-4 rounded-xl mt-4 flex-row justify-center items-center ${loading ? "opacity-70" : ""
            }`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading && <ActivityIndicator color="white" className="mr-2" />}
          <Text className="text-white text-center text-lg font-semibold">
            Register
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8 mb-10">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text className="text-blue-600 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
