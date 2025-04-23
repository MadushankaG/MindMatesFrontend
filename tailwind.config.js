// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { /* ... your custom colors ... */ },
      fontFamily: { /* ... your custom fonts ... */ },
      fontSize: { /* ... your custom sizes ... */ }
    },
  },
  plugins: [],
}