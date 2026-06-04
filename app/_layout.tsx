import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "ios_from_right", // Smoother, native-style transitions
        animationDuration: 400,      // Slightly slower for a more premium feel
      }}
    />
  );
}
