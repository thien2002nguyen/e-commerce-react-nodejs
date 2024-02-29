/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ['Poppins', 'sans-serif;']
      },
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131'
      },
      colors: {
        main: '#ee3131'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
        '9': '9 9 0%',
        '10': '10 10 0%',
        '11': '11 11 0%',
        '12': '12 12 0%',
      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(20px);',
            transform: 'translateY(20px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            transform: 'translateY(0);'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(8px);',
            transform: 'translateY(8px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
            transform: 'translateY(0);'
          }
        },
        'slide-right': {
          '0%': {
            '-webkit-transform': 'translateX(-1000px);',
            transform: 'translateX(-1000px);'
          },
          '100%': {
            '-webkit-transform': 'translateX(0);',
            transform: 'translateX(0);'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0;'
          },
          '100%': {
            opacity: '1;'
          }
        },
        'scale-up-br': {
          '0%': {
            '-webkit-transform': 'scale(0.5);',
            transform: 'scale(0.5);',
            '-webkit-transform-origin': '100% 100%;',
            'transform-origin': '100% 100%;',
          },
          '100%': {
            '-webkit-transform': 'scale(1);',
            transform: 'scale(1);',
            '-webkit-transform-origin': '100% 100%;',
            'transform-origin': '100% 100%;',
          }
        },
        'un-scale-up-br': {
          '0%': {
            '-webkit-transform': 'scale(1);',
            transform: 'scale(1);',
            '-webkit-transform-origin': '100% 100%;',
            'transform-origin': '100% 100%;',
          },
          '100%': {
            '-webkit-transform': 'scale(0.5);',
            transform: 'scale(0.5);',
            '-webkit-transform-origin': '100% 100%;',
            'transform-origin': '100% 100%;',
          }
        },
        'scale-up-tl': {
          '0%': {
            '-webkit-transform': 'scale(0.5);',
            transform: 'scale(0.5);',
            '-webkit-transform-origin': '0% 0%;',
            'transform-origin': '0% 0%;',
          },
          '100%': {
            '-webkit-transform': 'scale(1);',
            transform: 'scale(1);',
            '-webkit-transform-origin': '0% 0%;',
            'transform-origin': '0% 0%;',
          }
        }
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'slide-top-sm': 'slide-top-sm 0.2s linear both;',
        'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
        'fade-in': 'fade-in 0.3s linear both;',
        'scale-up-tl': 'scale-up-tl 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;',
        'scale-up-br': 'scale-up-br 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;',
        'un-scale-up-br': 'un-scale-up-br 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;',
      },
      listStyleType: {
        square: 'square',
        roman: 'upper-roman',
      },
      boxShadow: {
        'full-box-1': '-1px -1px 1px rgba(0, 0, 0, 0.5), 1px 1px 1px rgba(0, 0, 0, 0.5);'
      },
    },
  },
  plugins: [
    "@tailwindcss/line-clamp",
  ],
}
