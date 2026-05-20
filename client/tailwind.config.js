/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface-variant': '#2e3637', 'on-primary-container': '#006c71',
        'error': '#ffb4ab', 'secondary': '#d2bbff', 'on-error': '#690005',
        'primary': '#e9feff', 'on-secondary-container': '#c9aeff',
        'inverse-primary': '#00696e', 'on-error-container': '#ffdad6',
        'background': '#0d1515', 'surface-container-low': '#151d1d',
        'tertiary-fixed-dim': '#e7c427', 'tertiary-fixed': '#ffe16c',
        'secondary-fixed-dim': '#d2bbff', 'secondary-fixed': '#eaddff',
        'on-surface-variant': '#b9caca', 'error-container': '#93000a',
        'primary-container': '#00f5ff', 'surface-dim': '#0d1515',
        'surface-container-lowest': '#081010', 'on-primary': '#003739',
        'secondary-container': '#6001d1', 'on-tertiary': '#3a3000',
        'inverse-on-surface': '#2a3232', 'outline-variant': '#3a494a',
        'surface': '#0d1515', 'tertiary': '#fff9f0', 'on-primary-fixed': '#002021',
        'on-secondary-fixed': '#25005a', 'surface-container-high': '#232b2c',
        'surface-bright': '#323b3b', 'outline': '#849495',
        'on-primary-fixed-variant': '#004f53', 'on-secondary': '#3f008e',
        'primary-fixed': '#63f7ff', 'primary-fixed-dim': '#00dce5',
        'surface-container-highest': '#2e3637', 'on-tertiary-container': '#736000',
        'surface-tint': '#00dce5', 'on-background': '#dce4e4',
        'on-surface': '#dce4e4', 'tertiary-container': '#ffdb3f',
        'inverse-surface': '#dce4e4', 'surface-container': '#192121',
        'cream': '#faf7f2', 'cream-surface': '#ffffff',
        'emerald-brand': '#059669', 'emerald-light': '#10b981',
        'amber-accent': '#f59e0b', 'cream-text': '#1c1917',
        'cream-muted': '#78716c', 'emerald-border': '#d1fae5',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        hanken: ['Hanken Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(0,245,255,0.3)' },
          '50%': { boxShadow: '0 0 24px rgba(0,245,255,0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
