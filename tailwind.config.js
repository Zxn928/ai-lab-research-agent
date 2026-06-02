/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212f',
        muted: '#64748b',
        line: '#d9e2ec',
        panel: '#f7fafc',
        brand: '#0f766e',
        accent: '#b45309'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
