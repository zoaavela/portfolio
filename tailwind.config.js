/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        black: "#0D0D0D",
        offwhite: "#F0EDE8",
        pearl: "#EFEFED",
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
}