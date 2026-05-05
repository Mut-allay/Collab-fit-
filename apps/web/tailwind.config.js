/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			pacifico: ['Pacifico', 'cursive'],
  			manrope: ['Manrope', 'sans-serif'],
  			headline: ['Lexend', 'Manrope', 'sans-serif'],
  			body: ['Manrope', 'sans-serif'],
  			label: ['Inter', 'Manrope', 'sans-serif'],
  		},
  		colors: {
  			outline: '#747579',
  			'outline-variant': '#46484b',
  			'on-surface': '#f9f9fd',
  			'on-surface-variant': '#aaabaf',
  			'on-background': '#f9f9fd',
  			'on-primary': '#516700',
  			'on-primary-fixed': '#3a4a00',
  			'on-primary-container': '#4a5e00',
  			'on-secondary': '#565400',
  			'on-secondary-fixed': '#434100',
  			'on-error': '#450900',
  			'on-error-container': '#ffd2c8',
  			'on-tertiary': '#665800',
  			'on-tertiary-container': '#5d5000',
  			'primary-fixed': '#cafd00',
  			'primary-container': '#cafd00',
  			'primary-dim': '#beee00',
  			'secondary-fixed': '#ece856',
  			'secondary-container': '#636100',
  			'tertiary-container': '#fce047',
  			'surface-bright': '#292c31',
  			'surface-variant': '#23262a',
  			'surface-dim': '#0c0e11',
  			'surface-container': '#171a1d',
  			'surface-container-low': '#111417',
  			'surface-container-lowest': '#000000',
  			'surface-container-high': '#1d2024',
  			'surface-container-highest': '#23262a',
  			surface: '#0c0e11',
  			'kinetic-fg': '#f3ffca',
  			'kinetic-accent': '#cafd00',
  			error: '#ff7351',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			spark: {
  				'50': '#fff7ed',
  				'100': '#ffedd5',
  				'200': '#fed7aa',
  				'300': '#fdba74',
  				'400': '#fb923c',
  				'500': '#f97316',
  				'600': '#ea580c',
  				'700': '#c2410c',
  				'800': '#9a3412',
  				'900': '#7c2d12'
  			},
  			fitness: {
  				'50': '#f0f9ff',
  				'100': '#e0f2fe',
  				'200': '#bae6fd',
  				'300': '#7dd3fc',
  				'400': '#38bdf8',
  				'500': '#0ea5e9',
  				'600': '#0284c7',
  				'700': '#0369a1',
  				'800': '#075985',
  				'900': '#0c4a6e'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
