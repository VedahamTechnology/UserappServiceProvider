/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F97316",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        success: "#22C55E",
        warning: "#EAB308",
        danger: "#EF4444",

        textPrimary: "#0F172A",
        textSecondary: "#64748B",
      },
    },
  },
  plugins: [],
}
