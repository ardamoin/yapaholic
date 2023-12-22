/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "golden-yellow": "#FFE15D",
        "purple-pink": "#B01E68",
      },
    },
  },
  plugins: [],
};
