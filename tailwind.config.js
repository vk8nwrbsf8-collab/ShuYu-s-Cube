/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#FFFFFF',
        paper: '#000000',
      },
      fontFamily: {
        sketch: ['"Caveat"', '"Kalam"', 'cursive'],
        mono: ['"Special Elite"', 'monospace'],
        body: ['"Indie Flower"', 'cursive'],
      },
      animation: {
        'jitter': 'jitter 0.08s infinite',
        'jitter-slow': 'jitter 0.12s infinite',
        'jitter-text': 'jitterText 0.1s infinite',
        'fadeIn': 'fadeIn 0.6s ease forwards',
        'fadeOut': 'fadeOut 0.6s ease forwards',
        'bubbleIn': 'bubbleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'float': 'float 3s ease-in-out infinite',
        'drawLine': 'drawLine 1.5s ease forwards',
      },
      keyframes: {
        jitter: {
          '0%':   { transform: 'translate(0px, 0px) rotate(0deg)' },
          '20%':  { transform: 'translate(-0.4px, 0.3px) rotate(-0.2deg)' },
          '40%':  { transform: 'translate(0.3px, -0.4px) rotate(0.3deg)' },
          '60%':  { transform: 'translate(-0.3px, -0.2px) rotate(-0.1deg)' },
          '80%':  { transform: 'translate(0.4px, 0.2px) rotate(0.2deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
        },
        jitterText: {
          '0%':   { transform: 'translate(0px, 0px)' },
          '25%':  { transform: 'translate(0.3px, -0.2px)' },
          '50%':  { transform: 'translate(-0.3px, 0.3px)' },
          '75%':  { transform: 'translate(0.2px, 0.2px)' },
          '100%': { transform: 'translate(0px, 0px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
        bubbleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        drawLine: {
          from: { strokeDashoffset: '1000' },
          to:   { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
