/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ scans all React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F26C2B",
        dark: "#020202",
        light: "#F1F1F1",
      },
      fontFamily: {
        daraz: ["'Poppins'", "sans-serif"], // ✅ custom font
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        slideInLeft: "slideInLeft 0.5s ease-out",
        slideInRight: "slideInRight 0.5s ease-out",
      },
      animation: {
        glow: "glow 1.5s ease-in-out infinite",
        "bounce-slow": "bounce-slow 1.2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.4s ease-out forwards",
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
  plugins: [],
};
