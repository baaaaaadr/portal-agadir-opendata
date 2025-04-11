/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Assure que Tailwind scanne vos fichiers React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
