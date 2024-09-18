/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'highlight': '#14ff72'
      },
      height: {
        screen: "100vh", 
      },
      animation: {
        "slide-next": "slideNext 0.5s linear forwards",
        "slide-prev": "slidePrev 0.5s linear forwards",
      },
      keyframes: {
        slideNext: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slidePrev: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
