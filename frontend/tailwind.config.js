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
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        pageBg: '#F8FAFC',
        cardBg: '#FFFFFF',
        borderColor: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        successColor: '#22C55E',
        warningColor: '#F59E0B',
        dangerColor: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '24': '24px',
        '24px': '24px',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(17, 24, 39, 0.04), 0 1px 4px -1px rgba(17, 24, 39, 0.02)',
        'md': '0 4px 20px -2px rgba(17, 24, 39, 0.04), 0 2px 6px -1px rgba(17, 24, 39, 0.02)',
        'lg': '0 12px 28px -4px rgba(17, 24, 39, 0.08)',
      }
    },
  },
  plugins: [],
}
