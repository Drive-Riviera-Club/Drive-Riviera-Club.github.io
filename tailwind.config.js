/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B2538',
        forest: '#174F45',
        turquoise: '#408C7C',
        sage: '#88A99C',
        cream: '#F5F0E6',
        sand: '#DFD3BD',
        warm: '#FFFDF8',
        sunset: '#E9B949',
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"Segoe UI"', 'sans-serif'],
        accent: ['"Caveat"', '"Brush Script MT"', 'cursive'],
      },
      boxShadow: {
        card: '0 12px 32px rgba(11, 37, 56, 0.16)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 450ms ease-out',
      },
    },
  },
  plugins: [],
};
