/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy
        papaya: '#FF8000',
        // New LN4 palette
        lime: '#C8FF00',
        'lime-dark': '#A8D900',
        olive: '#1A1F10',
        'olive-mid': '#232C14',
        cream: '#F0EDE6',
        'cream-dark': '#E5E0D5',
        dark: '#0D0D0D',
        light: '#F5F5F5',
        // Store
        store_dark: '#1C2210',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(60px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-slow': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'fade-up': 'fade-up 0.8s ease forwards',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-out-right': 'slide-out-right 0.3s ease-in forwards',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
