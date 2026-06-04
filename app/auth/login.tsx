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

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    let newErrors: { email?: string; password?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (validate()) {
      console.log("Login successful", { email, password });
    }
  };

  const handleNav = (path: any, isReplace = true) => {
    Haptics.selectionAsync();
    if (isReplace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A8B8FF", paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
          className="px-6 pt-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
            >
              <Ionicons name="arrow-back" size={24} color="#031B52" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="mt-10 mb-12">
            <Text className="text-primary text-4xl font-extrabold">Welcome Back!</Text>
            <Text className="text-secondary text-lg mt-2">
              Login to continue using HomeStr
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <CustomInput
              label="Email Address"
              icon="mail-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
            />

            <CustomInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              isPassword={true}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
            />

            <TouchableOpacity
              onPress={() => handleNav("/auth/forgetpassword")}
              className="self-end mb-8"
            >
              <Text className="text-secondary font-bold">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
              <LinearGradient
                colors={["#031B52", "#043A75", "#05AFC7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 70 }}
                className="rounded-2xl justify-center items-center flex-row shadow-lg border border-white/20"
              >
                <Text className="text-white text-xl font-bold mr-2">Login</Text>
                <Ionicons name="log-in-outline" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ flex: 1, minHeight: 20 }} />

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} className="items-center py-6">
            <View className="flex-row">
              <Text className="text-secondary text-base">Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => handleNav("/auth/register")}>
                <Text className="text-primary font-bold text-base">Register</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
