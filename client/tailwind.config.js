/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          primary: '#0B4F37',
          accent: '#C53030',
          secondary: '#D97706'
        }
      }
    },
  },
  plugins: [],
}
