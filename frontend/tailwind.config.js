/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs exactes extraites du logo Luchnos
        primary: {
          DEFAULT: '#191F34', // Bleu nuit du fond du logo
          dark: '#1A2034',
          light: '#1C2235'
        },
        gold: {
          DEFAULT: '#FFC100', // Jaune du texte et flamme
          dark: '#E6AD00',
          light: '#FFD033'
        },
        copper: {
          DEFAULT: '#CC7447', // Orange/marron clair de la lampe
          dark: '#9F4A15',
          light: '#D98B5F'
        },
        flame: {
          yellow: '#FFC100', // Jaune flamme
          orange: '#FF8C00', // Orange flamme
          glow: '#FFD700' // Halo lumineux
        },
        slate: {
          DEFAULT: '#64748b',
          light: '#f1f5f9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(244, 196, 48, 0.3)',
        'glow-lg': '0 0 40px rgba(244, 196, 48, 0.4)',
        'flame': '0 0 30px rgba(255, 244, 79, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #191F34 0%, #1C2235 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFC100 0%, #FFD033 100%)',
        'gradient-flame': 'radial-gradient(circle, #FFC100 0%, #FF8C00 60%, #FFD700 100%)',
      }
    },
  },
  plugins: [],
}
