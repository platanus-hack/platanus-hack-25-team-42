import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        banmedica: {
          red: "#E30613",
          darkRed: "#c00510",
          gray: "#333333",
          lightGray: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "border-b": "0 1px 0 0 rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
