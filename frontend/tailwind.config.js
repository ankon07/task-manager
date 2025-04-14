/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#c084fc', // Light purple
          DEFAULT: '#a855f7', // Main purple
          dark: '#9333ea', // Dark purple
        },
        secondary: {
          light: '#ddd6fe', // Light lavender
          DEFAULT: '#c4b5fd', // Main lavender
          dark: '#a78bfa', // Dark lavender
        },
        background: {
          light: '#f5f3ff', // Very light lavender
          DEFAULT: '#ede9fe', // Light lavender background
          dark: '#1e1b4b', // Dark background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
