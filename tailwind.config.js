/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#65A7C0',
          DEFAULT: '#3E8CAA',
          dark: '#2A6F8C',
        },
        secondary: {
          light: '#F0E6D6',
          DEFAULT: '#E2D1B5',
          dark: '#C9B596',
        },
        accent: {
          light: '#F2AA7A',
          DEFAULT: '#E88C50',
          dark: '#D06F35',
        },
        neutral: {
          'soft-white': '#F8F9FA',
          'light-sand': '#F2EBE1',
          'charcoal': '#303841',
          'medium-gray': '#8A959E',
          'bg-light': '#F8F9FA',
          'surface-light': '#FFFFFF',
          'bg-alt-light': '#F2EBE1',
          'text-light': '#303841',
          'text-muted-light': '#8A959E',
          'bg-dark': '#303841',
          'surface-dark': '#3A444E',
          'bg-alt-dark': '#495057',
          'text-dark': '#F8F9FA',
          'text-muted-dark': '#ADB5BD',
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
