/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        muted: '#65738b',
        line: '#dce3ec',
        panel: '#f7f9fc',
        brand: '#087c73',
        accent: '#c2410c',
        navy: '#17233d'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(23, 32, 51, 0.07)',
        panel: '0 1px 2px rgba(23, 32, 51, 0.04), 0 10px 24px rgba(23, 32, 51, 0.05)'
      }
    }
  },
  plugins: []
};
