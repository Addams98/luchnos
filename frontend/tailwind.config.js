/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs officielles du logo Luchnos (fournies par le client)
        primary: {
          DEFAULT: '#191F34', // Bleu nuit du fond (couleur dominante)
          light: '#1C2235',   // Variante claire
          dark: '#1A2034'     // Variante foncée
        },
        gold: {
          DEFAULT: '#FFC100', // Jaune du texte et de la flamme
          light: '#FFD700',   // Jaune lumineux pour effets
          dark: '#E5AC00'     // Jaune foncé
        },
        copper: {
          DEFAULT: '#CC7447', // Orange/marron clair de la lampe
          light: '#DC9664',   // Variante claire
          dark: '#9F4A15'     // Marron foncé (ombrages et contours)
        },
        // Couleurs d'accent harmonieuses avec le logo
        accent: {
          green: '#2D7A3E',      // Carte Événements
          greenLight: '#3A9B51',
          orange: '#E67E22',     // Carte Contact
          orangeLight: '#F39C12',
          terracotta: '#B4643C', // Alternative terre cuite
          lightBlue: '#3498DB'   // Variation bleue
        },
        flame: {
          yellow: '#FFC100',  // Jaune flamme
          orange: '#FF8C00',  // Orange flamme
          glow: '#FFD700'     // Halo lumineux
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
        'gradient-primary': 'linear-gradient(135deg, #191F34 0%, #1C2235 100%)', // Bleu nuit du logo
        'gradient-gold': 'linear-gradient(135deg, #FFC100 0%, #FFD700 100%)',    // Jaune du logo
        'gradient-flame': 'radial-gradient(circle, #FFC100 0%, #FF8C00 60%, #FFD700 100%)', // Flamme
        'gradient-copper': 'linear-gradient(135deg, #CC7447 0%, #9F4A15 100%)',  // Cuivre de la lampe
      }
    },
  },
  plugins: [],
}
