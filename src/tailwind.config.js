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

        background: '#000',

        blue: {
          100: '#EAF8FD',
          200: '#CBEEF9',
          300: '#ABE3F5',
          400: '#6DCEEE',
          500: '#2EB9E7',
          600: '#29A7D0',
          700: '#1C6F8B',
          800: '#155368',
          900: '#0E3845',
        },

        violet: {
          100: '#F1E9FD',
          200: '#DBC7FA',
          300: '#C6A6F7',
          400: '#9B63F0',
          500: '#7020EA',
          600: '#651DD3',
          700: '#43138C',
          800: '#320E69',
          900: '#220A46',
        },

        pink: {
          100: '#FDF5FA',
          200: '#FBE5F3',
          300: '#F9D6EC',
          400: '#F4B7DE',
          500: '#EF98D0',
          600: '#D789BB',
          700: '#8F5B7D',
          800: '#6C445E',
          900: '#482E3E',
        },

        danger: {
          100: '#FEECEB',
          200: '#FCD0CD',
          300: '#FBB4AF',
          400: '#F77B72',
          500: '#F44336',
          default: '#F44336',
          600: '#DC3C31',
          700: '#922820',
          800: '#6E1E18',
          900: '#491410',
        },

        success: {
          100: '#EEF8ED',
          200: '#D5EDD1',
          300: '#BCE3B5',
          400: '#89CD7E',
          500: '#57B846',
          default: '#57B846',
          600: '#4EA63F',
          700: '#346E2A',
          800: '#275320',
          900: '#1A3715',
        },

        warning: {
          100: '#F9F2E8',
          200: '#F0DEC5',
          300: '#E6CBA2',
          400: '#D4A35C',
          500: '#C17C16',
          default: '#C17C16',
          600: '#AE7014',
          700: '#744A0D',
          800: '#57380A',
          900: '#3A2507',
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
