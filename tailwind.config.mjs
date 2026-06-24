import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F766E',
          50: '#ECFDF7',
          100: '#CCFBF1',
          400: '#14B8A6',
          700: '#115E59',
          900: '#134E4A',
        },
        ink: '#111827',
      },
      fontFamily: {
        sans: ['"Assistant"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Quattrocento"', 'Georgia', 'serif'],
        accent: ['"Mulish"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Quattrocento"', 'Georgia', 'serif'],
      },
      boxShadow: {
        premium: '0 24px 80px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 70px rgba(20, 184, 166, 0.18)',
      },
    },
  },
  plugins: [forms, typography],
};
