import React from "react";
import { View, Text, Image, Dimensions, ImageSourcePropType } from "react-native";

const { width } = Dimensions.get("window");

interface OnboardingItemProps {
  item: {
    title: string;
    description: string;
    image: ImageSourcePropType;
  };
}

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  return (
    <View style={{ width }} className="px-6 items-center">
      <View className="h-2/3 justify-center items-center">
        <Image
          source={item.image}
          style={{ width: width * 0.8, height: width * 0.8, resizeMode: "contain" }}
        />
      </View>
      <View className="h-1/3 items-center">
        <Text className="text-primary text-3xl font-extrabold text-center mb-4">
          {item.title}
        </Text>
        <Text className="text-secondary text-lg text-center px-4 leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingItem;
