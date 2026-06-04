import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { onboardingData } from "../constants/onboardingData";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 py-8 flex-row justify-between items-center">
          <Text className="text-primary text-3xl font-extrabold">Our Services</Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-secondary font-bold text-lg">Login</Text>
          </TouchableOpacity>
        </View>

        {/* Introduction */}
        <View className="px-6 mb-8">
          <Text className="text-secondary text-lg leading-6">
            Everything you need for your home, all in one place. Discover how HomeStr can help you.
          </Text>
        </View>

        {/* Services List */}
        <View className="px-6">
          {onboardingData.map((item) => (
            <View 
              key={item.id} 
              className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 items-center"
            >
              <Image
                source={item.image}
                style={{ width: 200, height: 180, resizeMode: "contain" }}
                className="mb-4"
              />
              <Text className="text-primary text-2xl font-bold text-center mb-2">
                {item.title}
              </Text>
              <Text className="text-secondary text-base text-center leading-5">
                {item.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Final CTA */}
        <View className="px-6 mt-4">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => router.push("/auth/login")}
          >
            <LinearGradient
              colors={["#031B52", "#043A75", "#05AFC7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-16 rounded-2xl justify-center items-center flex-row shadow-lg"
            >
              <Text className="text-white text-xl font-bold mr-2">Start Exploring</Text>
              <Ionicons name="rocket-outline" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
