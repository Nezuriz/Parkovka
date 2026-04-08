/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], 
      },
      colors: {
        'parkovka': {
          100: '#F1F3E0', // Paling terang
          200: '#D2DCB6',
          300: '#A1BC98',
          400: '#778873',
          500: '#344E31', // Paling gelap
        },
        'pure-white': '#FFFFFF',
        'pure-black': '#000000',
      },
    },
  },
  plugins: [],
}