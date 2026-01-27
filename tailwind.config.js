/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // This allows you to use 'font-fontello' as a Tailwind class
        fontello: ['fontello', 'sans-serif'],
      },
      keyframes: {
        'wave-in': {
          '0%': { 
            transform: 'scale(0.2)', 
            opacity: '0', 
            borderColor: 'rgba(255,255,255,0.8)' 
          },
          '50%': { 
            opacity: '0.5' 
          },
          '100%': { 
            transform: 'scale(1.5)', 
            opacity: '0', 
            borderColor: 'rgba(255,255,255,0)' 
          },
        },
      },
      animation: {
        'wave-in': 'wave-in 3s cubic-bezier(0.36, 0, 0.66, -0.56) infinite',
      },
    },
  },
  plugins: [],
}