/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfbf7',
          100: '#f6f3eb',
          200: '#e8e2d4',
          300: '#d7ccb8',
          400: '#bfaf96',
          500: '#a39075',
          600: '#85735b',
          700: '#685946',
          800: '#4c4133',
          900: '#2c251e',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#114225',
          950: '#0a2615',
        },
        accent: {
          amber: '#d97706',
          gold: '#f59e0b',
        },
        surface: {
          50: '#f8f7f4', // warm beige off-white
          100: '#efece6',
          200: '#e3dfd6',
          800: '#292524',
          900: '#1c1917', // warm charcoal
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
