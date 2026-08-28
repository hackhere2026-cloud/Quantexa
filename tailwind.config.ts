import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#D4A843', // Gold Amber
          dark: '#C9952E',    // Deep Gold
          glow: '#F0C755',    // Bright Gold Glow
        },
        ink: '#0A0E1A',
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
