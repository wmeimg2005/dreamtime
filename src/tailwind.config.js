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

      // https://javisperez.github.io/tailwindcolorshades/
      colors: {
        generic: {
          100: '#F7F7F8',
          200: '#ECECEE',
          300: '#E0E0E3',
          400: '#C8C8CE',
          500: '#B1B1B9',
          600: '#9F9FA7',
          700: '#6A6A6F',
          800: '#505053',
          900: '#353538',
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

        /*
        dark: {
          100: '#E8E8E9',
          200: '#C5C6C7',
          300: '#A2A3A5',
          400: '#5C5F62',
          500: '#161A1F',
          600: '#14171C',
          700: '#0D1013',
          800: '#0A0C0E',
          900: '#070809',
        },
        */

        navbar: {
          100: '#E6E6E7',
          200: '#C1C1C3',
          300: '#9B9C9E',
          400: '#515156',
          500: '#06070D',
          600: '#05060C',
          700: '#040408',
          800: '#030306',
          900: '#020204',
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
          100: '#FBF1E7',
          200: '#F5DCC4',
          300: '#EFC7A0',
          400: '#E29E58',
          500: '#D67411',
          default: '#D67411',
          600: '#C1680F',
          700: '#80460A',
          800: '#603408',
          900: '#402305',
        },
      },
    },
  },
  variants: {},
  plugins: [
    // eslint-disable-next-line global-require
    require('tailwindcss-alpha')({
      modules: {
        borderColor: {
          process: true,
        },
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
