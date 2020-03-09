// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    spacing: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
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
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'Roboto Slab',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'Times',
          'serif',
        ],
      },

      // https://javisperez.github.io/tailwindcolorshades/
      colors: {
        generic: {
          100: '#DCDCE0',
          200: '#D7D7DB',
          300: '#D2D2D7',
          400: '#CDCDD2',
          500: '#C8C8CE',
          600: '#B6B6BB',
          700: '#A4A4A9',
          800: '#929296',
          900: '#808084',
        },

        dark: {
          100: '#65676A',
          200: '#505255',
          300: '#3A3D40',
          400: '#25272B',
          500: '#0f1216',
          600: '#0E1014',
          700: '#0C0F12',
          800: '#0B0D10',
          900: '#0A0C0E',
        },

        /*
        dark: {
          100: '#232a32',
          200: '#20262d',
          300: '#1d2228',
          400: '#191e24',
          500: '#161a1f',
          600: '#13161a',
          700: '#0f1216',
          800: '#0c0e11',
          900: '#090a0c',
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

        background: '#060709',

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
          100: '#E5A667',
          200: '#E19A51',
          300: '#DD8D3C',
          400: '#DA8126',
          500: '#D67411',
          default: '#D67411',
          600: '#C36A0F',
          700: '#AF5F0E',
          800: '#9C550C',
          900: '#894A0B',
        },
      },

      boxShadow: {
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.56)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.56)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.55)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.54)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
      },
    },
  },
  variants: {},
  plugins: [
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
  corePlugins: {
    container: false,
  },
}
