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
    },
  },
  plugins: [],
};
