/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F0F',
        surface: '#161616',
        accent: '#D4882A',
        gold: '#C9A84C',
        muted: '#888888',
        border: '#2A2A2A',
        text: '#EEEEEE',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
