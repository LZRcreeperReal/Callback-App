/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F0EFEA',
        ink: '#171A1F',
        ledger: '#1F3A3D',
        ledgerLight: '#2C5054',
        pen: '#C1392B',
        go: '#2F7A52',
        highlighter: '#F5D949',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        hand: ['var(--font-hand)'],
      },
      keyframes: {
        strike: { from: { width: '0%' }, to: { width: '100%' } },
        stamp: {
          '0%': { transform: 'scale(1.5) rotate(-12deg)', opacity: '0' },
          '60%': { transform: 'scale(0.92) rotate(-12deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
      },
      animation: {
        strike: 'strike 0.6s ease-out 0.7s forwards',
        stamp: 'stamp 0.5s ease-out 1.1s backwards',
      },
    },
  },
  plugins: [],
};
