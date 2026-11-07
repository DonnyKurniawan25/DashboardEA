/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
      boxShadow: {
        neo: "4px 4px 0px #050505",
        "neo-sm": "2px 2px 0px #050505",
        "neo-lg": "6px 6px 0px #050505",
        "neo-cyan": "4px 4px 0px #00E5FF",
      },
    },
  },
  plugins: [],
};

