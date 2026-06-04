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

export default function Register() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    let newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) newErrors.name = "Full name is required";
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
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (validate()) {
      console.log("Registration successful", { name, email, password });
    }
  };

  const handleNav = (path: any) => {
    Haptics.selectionAsync();
    router.replace(path);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#A8B8FF", paddingTop: insets.top }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
          className="px-6 pt-8"
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
          <Animated.View entering={FadeInDown.delay(200).duration(600)} className="mt-8 mb-8">
            <Text className="text-primary text-4xl font-extrabold">Create Account</Text>
            <Text className="text-secondary text-lg mt-2">
              Join HomeStr and find professionals
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <CustomInput
              label="Full Name"
              icon="person-outline"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              error={errors.name}
            />

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

            <CustomInput
              label="Confirm Password"
              icon="shield-checkmark-outline"
              placeholder="Confirm your password"
              isPassword={true}
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
            />

            <TouchableOpacity activeOpacity={0.8} className="mt-4" onPress={handleRegister}>
              <LinearGradient
                colors={["#031B52", "#043A75", "#05AFC7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 70 }}
                className="rounded-2xl justify-center items-center flex-row shadow-lg border border-white/20"
              >
                <Text className="text-white text-xl font-bold mr-2">Register</Text>
                <Ionicons name="person-add-outline" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ flex: 1, minHeight: 20 }} />

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} className="mt-8 items-center py-4">
            <View className="flex-row">
              <Text className="text-secondary text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => handleNav("/auth/login")}>
                <Text className="text-primary font-bold text-base">Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
