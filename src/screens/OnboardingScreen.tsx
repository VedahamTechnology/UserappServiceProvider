import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    title: "Welcome to HOMSTR",
    description: "Your one-stop solution for finding the best local services.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Connect with Vendors",
    description: "Easily find and connect with verified vendors in your area.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Get it Done",
    description: "Professional services delivered right to your doorstep.",
    image: "https://via.placeholder.com/300",
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("LoginScreen");
    }
  };

  const handleSkip = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <View className="items-center">
          <Image
            source={{ uri: ONBOARDING_DATA[currentIndex].image }}
            className="w-72 h-72 rounded-full mb-10"
            resizeMode="cover"
          />
          <Text className="text-3xl font-bold text-gray-800 text-center">
            {ONBOARDING_DATA[currentIndex].title}
          </Text>
          <Text className="text-lg text-gray-500 text-center mt-4 px-6">
            {ONBOARDING_DATA[currentIndex].description}
          </Text>
        </View>

        <View className="flex-row mt-10">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>

      <View className="p-6 flex-row justify-between items-center">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-500 text-lg">Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 px-8 py-4 rounded-xl"
          onPress={handleNext}
        >
          <Text className="text-white text-lg font-semibold">
            {currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
