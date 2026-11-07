import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07152F",
        foreground: "#FFFFFF",
        primary: "#1746FF",
        secondary: "#00E5FF",
        card: "#FFFFFF",
        success: "#74FF44",
        danger: "#FF4B57",
        warning: "#FFE600",
        border: "#050505",
        "navy-light": "#0D2247",
        "navy-lighter": "#132D5E",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

