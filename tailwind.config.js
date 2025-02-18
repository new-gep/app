/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/layouts/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fde047",
        primaryLight: "#E5F5F0",
        secondary: "#F6DBB3",
        success: "#159E42",
        danger: "#FF3131",
        warning: "#ffb02c",
        dark: "#2f2f2f",
        light: "#E6E6E6",
        info: "#2B39B9",
        white: "#fff",
        label: "#8A8A8A",
        backgroundColor: "#fff",
        black: "#000",
      },
    },
  },
  plugins: [],
};
