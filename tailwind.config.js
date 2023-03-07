const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/index.css",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
    },
    variants: {
      extend: {
        transform: ["hover"],
      },
    },
    colors: {
      ...colors,
      // silver: "#FAFAFACC",
      // lightgray: "#E5E8ED",
      velvet: "#4E47DC",
      // darkgray: "#313033",
      // paperwhite: "#F3F4E9",
      // mediumgray: "#6B7280",
      // darkgrayWithOpacity: "#6b728080",
    },

    //
    // nightwind: {
    //   colorScale: {
    //     preset: "reduced",
    //   },
    //   colors: {
    //     white: "#0D0D0D",
    //     black: "#F2F2F2",
    //     silver: "#313033",
    //     gray: {
    //       50: "#0D0D0D",
    //       100: "#1A1A1A",
    //       200: "#272727",
    //       300: "#333333",
    //       400: "#4B4B4B",
    //       500: "#9B9B9B",
    //       // 600: "#BCBCBC",
    //       // 700: "#D1D1D1",
    //       // 800: 200,
    //       // 900: 100,
    //     },
    //   },
    // },
    //
  },
  plugins: [
    //require("nightwind"),
    require('flowbite/plugin'),
    require("@tailwindcss/aspect-ratio")
  ],
};
