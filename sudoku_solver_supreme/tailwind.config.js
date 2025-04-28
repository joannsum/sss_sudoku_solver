/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class', // or 'media' if you want to follow system preference
    theme: {
      extend: {
        colors: {
          'neon-pink': 'var(--neon-pink)',
          'neon-blue': 'var(--neon-blue)',
          'neon-purple': 'var(--neon-purple)',
          'cyber-yellow': 'var(--cyber-yellow)',
          'background': 'var(--background)',
          'foreground': 'var(--foreground)',
          'grid-background': 'var(--grid-background)',
          'grid-border': 'var(--grid-border)',
        },
      },
    },
    plugins: [],
  }