/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Enterprise data-tool palette: Power BI density + Postman confidence + Excel precision.
        // These read from CSS variables (defined in index.css) so a single
        // `.dark` class toggle on <html> re-themes every component at once.
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        ink: {
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          500: 'rgb(var(--color-ink-500) / <alpha-value>)',
          300: 'rgb(var(--color-ink-300) / <alpha-value>)',
          100: 'rgb(var(--color-ink-100) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: '#161B26',    // dark slate sidebar
          hover: '#1F2532',
          active: '#252C3D',
        },
        brand: {
          DEFAULT: '#0D9488',    // teal - primary accent
          dark: '#0F766E',
          light: '#CCFBF1',
        },
        accent: {
          blue: '#2563EB',
          amber: '#D97706',
          rose: '#E11D48',
          violet: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'tabular-lg': ['1.75rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        'card-hover': '0 2px 8px 0 rgba(15, 23, 42, 0.08)',
        popover: '0 8px 24px -4px rgba(15, 23, 42, 0.12)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}