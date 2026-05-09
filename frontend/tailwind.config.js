/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hh: {
          bg:      '#0a0a0a',
          surface: '#141414',
          border:  '#1e1e1e',
          amber:   '#f5a623',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
