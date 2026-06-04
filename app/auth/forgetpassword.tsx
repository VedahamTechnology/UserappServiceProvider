import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import CustomInput from "../../components/CustomInput";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ForgetPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (validate()) {
      console.log("Reset link sent to", email);
    }
  };

  const handleBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A8B8FF", paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
          className="px-6 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <TouchableOpacity
              onPress={handleBack}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
            >
              <Ionicons name="arrow-back" size={24} color="#031B52" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="mt-10 mb-12">
            <Text className="text-primary text-4xl font-extrabold">Forgot Password?</Text>
            <Text className="text-secondary text-lg mt-4">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
          </Animated.View>

          {/* Illustration/Icon */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} className="items-center mb-12">
            <View className="w-32 h-32 bg-white rounded-full items-center justify-center shadow-md">
              <Ionicons name="key-outline" size={60} color="#043A75" />
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <CustomInput
              label="Email Address"
              icon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(undefined);
              }}
              error={error}
            />

            <TouchableOpacity activeOpacity={0.8} className="mt-6" onPress={handleReset}>
              <LinearGradient
                colors={["#031B52", "#043A75", "#05AFC7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 70 }}
                className="rounded-2xl justify-center items-center flex-row shadow-lg border border-white/20"
              >
                <Text className="text-white text-xl font-bold mr-2">Send Reset Link</Text>
                <Ionicons name="paper-plane-outline" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ flex: 1, minHeight: 20 }} />

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)} className="mt-auto items-center py-6">
            <TouchableOpacity onPress={handleBack}>
              <Text className="text-primary font-bold text-base">Back to Login</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
