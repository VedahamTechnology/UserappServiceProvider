import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-between py-10">

        {/* Top Content */}
        <View className="items-center mt-10">

          {/* User Icon Circle */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="w-52 h-52 bg-white rounded-full items-center justify-center shadow-lg mt-10"
          >
            <Ionicons
              name="person-outline"
              size={120}
              color="#031B52"
            />
          </Animated.View>

          {/* Decorative Stars */}
          <Text className="absolute left-8 top-20 text-3xl text-white">✦</Text>
          <Text className="absolute right-10 top-32 text-3xl text-white">✦</Text>
          <Text className="absolute left-12 top-72 text-2xl text-white">○</Text>
          <Text className="absolute right-14 top-80 text-2xl text-white">●</Text>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <Text className="text-secondary mb-5 text-5xl font-extrabold text-center mt-14">
              Welcome to{"\n"}HomeStr
            </Text>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <Text className="text-secondary text-center text-xl mt-8  px-4">
              Find trusted professionals for your{"\n"}
              home services. Book, manage and{"\n"}
              get things done with ease.
            </Text>
          </Animated.View>
        </View>

        {/* Bottom Button */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)}>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handlePress}
          >
            <LinearGradient
              colors={["#031B52", "#043A75", "#05AFC7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 70,
                borderRadius: 22,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "700",
                }}
              >
                Get Started
              </Text>

              <Ionicons
                name="arrow-forward"
                size={28}
                color="white"
                style={{ marginLeft: 15 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}