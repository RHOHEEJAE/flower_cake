/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#2C1A0E',
          cream: '#F5ECD7',
          terra: '#C8744D',
          bg: '#FDFAF5',
          light: '#EDE0C8',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif KR"', '"Cormorant Garamond"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
