const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'white-glow': '0 0 15px rgba(255, 255, 255, 0.3)',
        'white-glow-str': '0 0 15px rgba(255, 255, 255, 1)',
      },
      colors: {
        'white-soft': '#FEFEFE',
        'black-soft': '#222222', 
        'gray-soft': '#4B5563', 
        'button': '#1D57A6',
      },
      
      backgroundImage: {
        "background-light":
          "linear-gradient(to bottom, #00050c, #02172c, #04234a)",
        "voice-button": "linear-gradient(to bottom, #0D1B2A, #3A86FF)",
      },
      spacing: {
        "space-2x": "16px",
        "header-h": "54px",
        "footer-h": "24px",
      },
      fontSize: {
        base: "16px",
        strong: "24px",
        max: "32px",
      },
      fontFamily: {
        sans: ['var(--font-zen-maru)', 'sans-serif'],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), nextui()],
};
