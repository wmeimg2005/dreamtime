// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    spacing: {
      px: '1px',
      0: '0',
      2: '0.5rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      18: '4.5rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },

    extend: {
      fontFamily: {
        sans: [
          'Catamaran',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },

      colors: {
        generic: {
          100: '#d0d0d5',
          200: '#c8c8ce',
          300: '#c1c1c7',
          400: '#b9b9c0',
          500: '#b1b1b9',
          600: '#9f9fa7',
          700: '#8e8e94',
          800: '#7c7c82',
          900: '#6a6a6f',
        },

        dark: {
          100: '#21262d',
          200: '#1e2329',
          300: '#1b2026',
          400: '#191d22',
          500: '#161a1f',
          600: '#12161b',
          700: '#0d1017',
          800: '#070912',
          900: '#00010c',
        },

        blue: {
          default: '#2eb9e7',
        },

        violet: {
          default: '#7020ea',
        },

        pink: {
          default: '#ef98d0',
        },

        danger: {
          default: '#f44336',
          500: '#f44336',
        },

        success: {
          default: '#57b846',
          500: '#57b846',
        },

        warning: {
          default: '#c17c16',
          500: '#c17c16',
        },

        primary: {
          100: '#f6e3cf',
          200: '#eec79f',
          300: '#e6ab70',
          400: '#de8f40',
          default: '#d67411',
          500: '#d67411',
          600: '#ab5c0d',
          700: '#80450a',
          800: '#552e06',
          900: '#2a1703',
        },
      },
    },
  },
  variants: {},
  plugins: [
    // eslint-disable-next-line global-require
    require('tailwindcss-alpha')({
      modules: {
        backgroundColors: true,
      },
      alpha: {
        10: 0.1,
        20: 0.2,
        30: 0.3,
        40: 0.4,
        50: 0.5,
        60: 0.6,
        70: 0.7,
        80: 0.8,
        90: 0.9,
      },
    }),
  ],
}
