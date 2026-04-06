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
        'white-glow': '0 0 10px rgba(255, 255, 255, 0.3)',
        'white-glow-str': '0 0 15px rgba(255, 255, 255, 1)',
      },
      colors: {
        'white-soft': '#FEFEFE',
        'black-soft': '#222222', 
        'gray-soft': '#4B5563',
        'button': '#1D57A6',
      },

      backgroundImage: {
        'background-light': 'linear-gradient(to bottom, #00040a, #003569, #004E9A)',
        'voice-button': 'linear-gradient(to bottom, #0D1B2A, #3A86FF)',
      },
      spacing: {
        'space-2x': '16px',
        'header-h': '54px',
        'footer-h': '24px',
      },
      fontSize: {
        base: '16px',
        strong: '24px',
        max: '32px',
      },
      fontFamily: {
        sans: ["var(--font-zen-maru)", "sans-serif"],
      },

      // アニメーション関連
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(-150%)" },
        },
        bounceRight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        bounceSlow: {
          // ヘッドフォン用
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5%)" },
        },
        dot1: {
          // ドットアニメーション
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        dot2: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        dot3: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        poke: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-12px)" },
        },
      },
      animation: {
        marquee: "marquee 12s linear infinite",
        bounceRight: "bounceRight 0.6s ease-in-out infinite",
        bounceSlow: "bounceSlow 5.0s ease-in-out infinite", // ヘッドフォン
        dot1: "dot1 2.5s infinite ease-in-out 0s",
        dot2: "dot2 2.5s infinite ease-in-out 0.2s",
        dot3: "dot3 2.5s infinite ease-in-out 0.4s",
        poke: "poke 1.2s infinite ease-in-out",
      },

      transitionDelay: {
        0: "0s",
        150: "0.15s",
        300: "0.3s",
      },
    },
  },
  // plugins: [nextui()],
};
