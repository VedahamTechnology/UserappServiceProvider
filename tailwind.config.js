/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",       // ✅ Include app folder for expo-router
    "./components/**/*.{js,jsx,ts,tsx}" // ✅ Include any shared UI components
  ],
  presets: [require("nativewind/preset")],
   theme: {
    extend: {
      colors: {
        background:"#A8B8FF",
        primary: "#031B52",
        secondary: "#043A75",
        ternary:"#b4c3fd",
        light: {
          100: "#D6C7FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221F3D",
          200: "#0F0D23",
        },
        accent: "#AB8BFF",
      },
    },
  },
  plugins: [],
};
