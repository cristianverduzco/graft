/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  "#f4f7f4",
          100: "#e6ede6",
          200: "#cddccd",
          300: "#a8c1a8",
          400: "#7fa07f",
          500: "#5d825d",
          600: "#476847",
          700: "#39533a",
          800: "#2f4330",
          900: "#283729",
        },
        // Semantic surface aliases
        page:     "#f4f7f4", // sage-50 — never pure white
        card:     "#ffffff",
        elevated: "#fafcfa",
        // Semantic text aliases
        primary:   "#283729", // sage-900
        secondary: "#476847", // sage-600
        tertiary:  "#7fa07f", // sage-400
        // Brand
        brand:      "#5d825d", // sage-500
        "brand-dark":  "#476847", // sage-600
        "brand-light": "#cddccd", // sage-200
        // Verdict / semantic (used ONLY for verdicts and alerts, never decoratively)
        safe:    "#5c9a5c",
        caution: "#d4a04c",
        danger:  "#b85450",
        // AI accent — used only on AI pill tags and chat button
        ai: "#6b7fbf",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
