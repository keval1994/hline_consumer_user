const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          md: "2rem",
          lg: "3rem",
          xl: "4rem",
          xsm: "425px",
          "2xl": "5rem",
          "3xl": "6rem",
        },
        screens: {
          DEFAULT: "100%",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xsm": "375px",
          "2xl": "1536px",
          "3xl": "2000px",
        },
      },
      colors: {
        ...colors,
        primary: "#051747",
        secondary: "#535F80",
        accent: "#081F62",
        soft: "#E7E9F0",
        base: "#FEFEFE",
        red: "#EF4444",
        green: "#16A34A",
      },
    },
  },
  plugins: [],
};
