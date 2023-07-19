/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    boxShadow: {
      lg: "0px 5px 14px rgba(244, 105, 76, 0.25)",
    },
    color: {
      gray: {
        50: "#F9FAFB",
        300: "#F1F1F1",
        400: "#E0E0E0",
        500: "#AEAEAE",
        600: "#7E7E7E",
        900: "#303030",
      },
      blue: {
        500: "#1976D2",
        600: "#0C63D4",
      },
      teal: {
        500: "#40B2B7",
        600: "#188F95",
      },
      orange: {
        500: "#F4694C",
        600: "#ee5c3e",
      },
    },
    boxShadow: {
      lg: "0px 5px 14px rgba(244, 105, 76, 0.25)",
    },
    extends: {
      transitionProperty: {
        'width': "width",
      },
    },
  },
  plugins: [],
};
