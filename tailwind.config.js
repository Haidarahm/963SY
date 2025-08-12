/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      fontFamily: {
        sans: ["Cairo", "sans-serif"],
      },
      colors: {
        // Primary orange gradient colors (from your buttons/hover effects)
        primary: {
          100: '#FFF8F3',  // Lightest gradient color
          200: '#FFE8D9',  // Light gradient color
          300: '#F2A81B',  // Yellow-orange
          400: '#F28B1B',  // Medium orange
          500: '#F26A1B',  // Base orange (your main color)
          600: '#E05D16',  // Slightly darker
          700: '#C84F12',  // Darker
          800: '#A5410E',  // Even darker
          900: '#7A300A',  // Darkest
          gradient: 'linear-gradient(90deg, #F26A1B 0%, #F2A81B 100%)',
          hover: 'linear-gradient(90deg, #F26A1B 0%, #F28B1B 100%)',
        },
   

        // Shadow colors
        shadow: {
          DEFAULT: '0 5px 15px rgba(0, 0, 0, 0.1)',
          hover: '0 15px 30px rgba(242, 106, 27, 0.3)',
          glow: '0 0 10px rgba(242, 106, 27, 0.5)',
        },

        // Gradient definitions
        gradient: {
          card: 'linear-gradient(135deg, #FFF8F3 0%, #FFE8D9 100%)',
          title: 'linear-gradient(90deg, #F26A1B 0%, #F2A81B 100%)',
          button: 'linear-gradient(90deg, #F26A1B 0%, #F28B1B 100%)',
        }
      },
    }
  },
  plugins: [],
};
