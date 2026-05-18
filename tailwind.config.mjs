import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0052CC',
          50: '#F0F5FF',
          100: '#DBE8FF',
          700: '#003F9E',
        },
        ink: '#101828',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [forms, typography],
};
