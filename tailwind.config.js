/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust according to your project
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F26C2B",
        dark: "#020202",
        light: "#F1F1F1",
      },
      fontFamily: {
        daraz: ["'Poppins'", "sans-serif"], // ✅ custom font (self-hosted)
      },
    },
  },
  plugins: [],
};
