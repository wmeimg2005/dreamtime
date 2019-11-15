// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Catamaran',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },

      colors: {
        generic: {
          100: '#DAD9DE',
          200: '#C2C1C8',
          300: '#A9A8B2',
          400: '#918F9C',
          default: '#797786',
          600: '#6E6D7A',
          700: '#64626E',
          800: '#595762',
          900: '#4E4C56'
        },

        dark: {
          100: '#53565f',
          200: '#474a51',
          300: '#3b3d44',
          400: '#3b3d44',
          500: '#2f3136',
          600: '#2a2c30',
          700: '#25272b',
          800: '#202225',
          900: '#1c1d20',
        },

        darker: {
          100: '#4f555c',
          200: '#43484e',
          300: '#383b40',
          400: '#2c2f33',
          500: '#202225',
          600: '#1c1e21',
          700: '#191b1d',
          800: '#161719',
          900: '#131416',
        },

        darklight: {
          100: '#656a76',
          200: '#595e68',
          300: '#4e525a',
          400: '#42454d',
          500: '#36393f',
          600: '#303338',
          700: '#2b2d32',
          800: '#25272c',
          900: '#202225',
        },

        blue: {
          default: '#2eb9e7'
        },

        violet: {
          default: '#7020ea'
        },

        pink: {
          default: '#ef98d0'
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
      }
    }
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
