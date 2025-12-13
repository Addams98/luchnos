/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette extraite du logo Luchnos (extraction automatique)
        primary: {
          DEFAULT: '#14283C', // Bleu marine du fond (53.77% du logo)
          light: '#1F3D5C',
          dark: '#0A1420'
        },
        gold: {
          DEFAULT: '#FFC100', // Jaune doré de la flamme
          light: '#FFD700',
          dark: '#E5AC00'
        },
        copper: {
          DEFAULT: '#C8783C', // Cuivre/bronze de la lampe
          light: '#DC9664',
          dark: '#A05028'
        },
        // Couleurs d'accent pour les cartes (harmonieuses avec le logo)
        accent: {
          green: '#2D7A3E',      // Pour carte Événements
          greenLight: '#3A9B51',
          orange: '#E67E22',     // Pour carte Contact (remplace violet)
          orangeLight: '#F39C12',
          terracotta: '#B4643C', // Alternative terre cuite
          lightBlue: '#3498DB'   // Variation bleue
        },
        flame: {
          yellow: '#FFC100',
          orange: '#FF8C00',
          glow: '#FFD700'
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
