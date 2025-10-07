// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kantumruy: ["var(--font-kantumruy)", "sans-serif"],
      },
      colors: {
        "brand-background": "#F0F0F0",
        "brand-pink-light": "#FFCAD4",
        "brand-pink-mid": "#FF8EA3",
        "brand-pink-dark": "#FF7891",
        "brand-pink-text": "#EC939F",
        "brand-purple": {
          light: "#9F6684",
          DEFAULT: "#612B47",
          dark: "#612B47",
        },

        "brand-chat": {
          bg: "#F5EBF6",
          user: "#94669F",
          bar: "#F1D4F0",
        },
      },
    },
  },
  plugins: [],
};
