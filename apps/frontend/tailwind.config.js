/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        'brand-primary': '#4f46e5',
        surface: '#f8fafc',
        'border-subtle': '#e2e8f0',
        'status-available':   '#22c55e',
        'status-in-use':      '#3b82f6',
        'status-maintenance': '#f59e0b',
        'status-retired':     '#6b7280',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99,102,241,0.25)',
        'glow-green':  '0 0 16px rgba(34,197,94,0.22)',
        'glow-blue':   '0 0 16px rgba(59,130,246,0.22)',
        'glow-amber':  '0 0 16px rgba(245,158,11,0.22)',
        'glow-violet': '0 0 16px rgba(139,92,246,0.22)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
