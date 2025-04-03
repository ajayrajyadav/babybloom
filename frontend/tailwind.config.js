
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bubble: '#FEC8D8',
        babyblue: '#C8E7F5',
        skyblue: '#AEE0FA',
        cotton: '#D1C4E9',
        brightpink: '#FF8FA3',
        navy: '#2D2E5F',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
};
