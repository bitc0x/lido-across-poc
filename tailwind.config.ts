import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lido-bg': '#0b0e1a',
        'lido-card': '#141926',
        'lido-border': '#1e2640',
        'lido-blue': '#00a3ff',
        'lido-green': '#5ac878',
        'lido-text': '#e8edf5',
        'lido-muted': '#6b7a99',
        'across-orange': '#ff6640',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
