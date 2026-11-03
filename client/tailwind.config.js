/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oromia: {
          red: '#D91B24',
          black: '#1A1A1A',
          white: '#FFFFFF',
          green: '#008751',
          gold: '#E5A823',
          dark: '#0F172A',
          primary: '#0B4F37', // Deep institutional emerald green
          accent: '#C53030',  // Institutional crimson
          secondary: '#D97706' // Warm gold
        }
      }
    },
  },
  plugins: [],
}
