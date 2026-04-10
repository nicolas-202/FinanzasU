/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#24389c',
        'primary-container': '#3f51b5',
        'primary-fixed': '#dee0ff',
        'primary-fixed-dim': '#bac3ff',
        'on-primary': '#ffffff',
        'on-primary-container': '#cacfff',
        'on-primary-fixed': '#00105c',
        'on-primary-fixed-variant': '#293ca0',
        'inverse-primary': '#bac3ff',

        secondary: '#006d36',
        'secondary-container': '#83fba5',
        'secondary-fixed': '#83fba5',
        'secondary-fixed-dim': '#66dd8b',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#00743a',
        'on-secondary-fixed': '#00210c',
        'on-secondary-fixed-variant': '#005227',

        tertiary: '#7c2500',
        'tertiary-container': '#9f390e',
        'tertiary-fixed': '#ffdbcf',
        'tertiary-fixed-dim': '#ffb59c',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffc6b3',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        background: '#f8f9fa',
        surface: '#f8f9fa',
        'surface-dim': '#d9dadb',
        'surface-bright': '#f8f9fa',
        'surface-variant': '#e1e3e4',
        'surface-tint': '#4355b9',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f4f5',
        'surface-container': '#edeeef',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e4',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f2',

        'on-surface': '#191c1d',
        'on-surface-variant': '#454652',
        'on-background': '#191c1d',

        outline: '#757684',
        'outline-variant': '#c5c5d4',

        success: '#006d36',
        warning: '#f59e0b',
        danger: '#ba1a1a',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
        'slide-down': 'slideDown 0.3s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
