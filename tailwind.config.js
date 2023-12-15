/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        callout: ['0.75rem', '1rem'],
        body: ['1rem', '1.25rem'],
        label: ['1.125rem', '1.5rem'],
        title3: ['1.25rem', '1.5rem'],
        title2: ['1.5rem', '1.75rem'],
        title1: ['1.75rem', '2.25rem'],
        'large-title': ['2.125rem', '2.625rem'],
      },
    },
  },
  plugins: [],
};
