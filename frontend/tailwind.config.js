module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safe: {
          blue: '#0066CC',
          green: '#28A745',
          orange: '#FFC107',
          red: '#DC3545',
          cyan: '#17A2B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
