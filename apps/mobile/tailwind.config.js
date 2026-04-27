/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Graft palette — muted, medical-adjacent without being clinical
        sage: {
          50: "#f4f7f4",
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
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
