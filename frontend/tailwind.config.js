/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef1f6",
          100: "#d9e0ec",
          200: "#b3c1d9",
          300: "#8299bf",
          400: "#56719d",
          500: "#3a5480",
          600: "#2c4066",
          700: "#223252",
          800: "#1a2740",
          900: "#131c30",
        },
        accent: {
          400: "#e8a33d",
          500: "#cf8a24",
          600: "#a86f16",
        },
        ink: "#1a1d24",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        cardHover: "0 8px 24px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};
