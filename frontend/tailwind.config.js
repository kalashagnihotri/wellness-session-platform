/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb85c',
          500: '#4CAF50', // Main primary green
          600: '#3f8f43',
          700: '#357339',
          800: '#2e5c31',
          900: '#264d29',
        },
        secondary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196F3', // Main secondary blue
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        accent: {
          50: '#fffbf0',
          100: '#fff5d6',
          200: '#ffe8a3',
          300: '#ffd966',
          400: '#ffc947',
          500: '#FFC107', // Main accent yellow
          600: '#ffb300',
          700: '#ff8f00',
          800: '#ff6f00',
          900: '#e65100',
        },
        wellness: {
          background: '#F9FAFB',
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        success: '#22C55E',
        error: '#DC2626',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
