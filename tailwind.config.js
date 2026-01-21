/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',      // indigo-500 - 主色
          secondary: '#64c8ff',    // 科技蓝 - 强调色
          surface: {
            DEFAULT: 'rgba(10, 20, 30, 0.85)',
            hover: 'rgba(20, 40, 60, 0.95)',
          },
          border: 'rgba(100, 200, 255, 0.3)',
        }
      },
      borderRadius: {
        panel: '24px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
      }
    },
  },
  plugins: [],
}
