import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../users-mfe/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#f0f2f8',
        surface: '#ffffff',
        'surface-2': '#f0f4ff',
        border: '#dde3f5',
        'text-primary': '#06084a',
        'text-secondary': '#5a5e8a',
        accent: '#FFD400',
        'accent-hover': '#ffe033',
        brand: '#1400CC',
        'brand-dark': '#0e0099',
        'brand-light': '#e8e5ff',
      },
    },
  },
} satisfies Config
