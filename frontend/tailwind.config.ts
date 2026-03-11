/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-helvetica)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'cah-black': '#000000',
        'cah-white': '#ffffff',
        'cah-gray': '#f5f5f5',
        'cah-border': '#e0e0e0',
      },
    },
  },
  plugins: [],
};
