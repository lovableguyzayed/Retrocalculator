/** @type {import('tailwindcss').Config} */
export default {
  // Scan every source file so all utility classes — including the ones built
  // dynamically inside updateSystemMessage() template strings — are compiled
  // into the static stylesheet that ships with the app (works offline).
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0a1a',
        'bg-card': '#1a1a2e',
        'primary': '#6B88D3',
        'accent': '#EFEFBB',
        'dark-blue': '#00008B',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'russo': ['Russo One', 'sans-serif'],
        'share-tech': ['Share Tech Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
