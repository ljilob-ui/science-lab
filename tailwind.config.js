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
        neo: {
          yellow: '#FFE600',
          pink: '#FF4A8D',
          cyan: '#00F0FF',
          green: '#10B981',
          lime: '#A3E635',
          purple: '#A855F7',
          orange: '#FF7A00',
          blue: '#3B82F6',
          bg: '#F4F4F0',
          darkBg: '#0F172A',
          card: '#FFFFFF',
          darkCard: '#1E293B',
          border: '#000000',
          darkBorder: '#FFFFFF'
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-white': '4px 4px 0px 0px #FFFFFF',
        'brutal-white-lg': '6px 6px 0px 0px #FFFFFF',
      },
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
