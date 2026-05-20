/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        hanken: ['Hanken Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // ── Dark (Cyberpunk) ──────────────────────────────
        background:               { DEFAULT: '#0d1515' },
        surface:                  { DEFAULT: '#0d1515', container: '#121e1e', 'container-low': '#0f1919', 'container-lowest': '#091212', 'container-high': '#1a2c2c', variant: '#1a2c2c' },
        'on-surface':             { DEFAULT: '#dce4e4', variant: '#7a9898' },
        'outline-variant':        { DEFAULT: '#1f3333' },
        'primary-container':      { DEFAULT: '#00f5ff' },
        'on-primary':             { DEFAULT: '#000d0d' },
        'primary-fixed':          { DEFAULT: '#63f7ff' },
        'primary-fixed-dim':      { DEFAULT: '#00c8d4' },
        'secondary-container':    { DEFAULT: '#7c3aed' },
        'on-secondary-container': { DEFAULT: '#d2bbff' },
        'secondary-fixed-dim':    { DEFAULT: '#d2bbff' },
        secondary:                { DEFAULT: '#7c3aed' },
        'tertiary-fixed':         { DEFAULT: '#ffdb3f' },
        error:                    { DEFAULT: '#ffb4ab', container: '#930a0a' },
        'error-container':        { DEFAULT: '#930a0a' },
      },
    },
  },
  plugins: [],
};
