/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#faf7f3',
          light: '#ffffff',
          dark: '#f3ede5'
        },
        obsidian: {
          DEFAULT: '#111111',
          light: '#222222',
          muted: '#666666'
        },
        coral: {
          DEFAULT: '#eb4d6d',
          hover: '#d9395a'
        }
      },
      fontFamily: {
        display: ['"Clash Grotesk"', 'Archivo', 'sans-serif'],
        sans: ['Archivo', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px'
      }
    },
  },
  plugins: [],
}
