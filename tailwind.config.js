/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#3a7d44',
          light: '#edf5ee',
          mid: '#52a85f',
          dark: '#5dbf6a',
        },
        // Dark mode: shift away from near-black to dark gray
        neutral: {
          950: '#1e1e1e', // was #0a0a0a — main dark background
          900: '#2a2a2a', // was #171717 — elevated surfaces
        },
      },
    },
  },
  plugins: [],
}
