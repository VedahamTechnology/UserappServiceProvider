import React, { useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  isPassword?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  label, 
  icon, 
  placeholder, 
  isPassword, 
  showPassword, 
  togglePassword, 
  value, 
  onChangeText,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-5">
      <Text className="text-secondary font-semibold text-lg mb-2">{label}</Text>
      <View 
        className={`flex-row items-center bg-white rounded-2xl px-4 py-1 shadow-sm border ${
          error ? "border-red-500" : isFocused ? "border-primary" : "border-gray-100"
        }`}
      >
        <Ionicons 
          name={icon} 
          size={22} 
          color={error ? "#ef4444" : isFocused ? "#031B52" : "#043A75"} 
          className="mr-3" 
        />
        <TextInput
          placeholder={placeholder}
          secureTextEntry={isPassword && !showPassword}
          className="flex-1 h-12 text-primary text-base"
          placeholderTextColor="#9CA4AB"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePassword}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#043A75"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 mt-1 ml-1 text-sm">{error}</Text>}
    </View>
  );
};

export default CustomInput;
