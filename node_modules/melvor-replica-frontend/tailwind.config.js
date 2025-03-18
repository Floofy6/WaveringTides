/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--button-primary)',
          dark: 'var(--button-hover)',
        },
        success: {
          DEFAULT: 'var(--success-color)',
        },
        danger: {
          DEFAULT: 'var(--error-color)',
        },
        warning: {
          DEFAULT: 'var(--gold-color)',
        },
        background: 'var(--bg-color)',
        text: 'var(--text-color)',
        panel: {
          DEFAULT: 'var(--panel-bg)',
          border: 'var(--panel-border)',
        },
        item: {
          bg: 'var(--item-bg)',
        },
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      keyframes: {
        playerAttack: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(20px)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(0)' },
        },
        enemyAttack: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-20px)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(0)' },
        },
        hitSplat: {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'player-attack': 'playerAttack 0.5s ease-in-out',
        'enemy-attack': 'enemyAttack 0.5s ease-in-out',
        'hit-splat': 'hitSplat 0.5s ease-out forwards',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
} 