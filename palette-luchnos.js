/**
 * PALETTE DE COULEURS LUCHNOS
 * Extraite du logo officiel
 */

const palette = {
  // Couleur principale - Bleu marine foncé (53.77% du logo)
  primary: {
    DEFAULT: '#14283C',
    light: '#1F3D5C',
    dark: '#0A1420'
  },
  
  // Couleur accent - Tons cuivre/bronze/or du logo
  copper: {
    DEFAULT: '#C8783C',  // Cuivre principal
    light: '#DC9664',
    dark: '#A05028'
  },
  
  // Doré/Jaune - Pour les accents lumineux
  gold: {
    DEFAULT: '#FFC100',  // Jaune doré
    light: '#FFD700',
    dark: '#E5AC00'
  },
  
  // Couleurs complémentaires pour les cartes
  accent: {
    // Vert naturel (remplace le vert actuel)
    green: '#2D7A3E',
    greenLight: '#3A9B51',
    
    // Orange chaleureux (remplace le violet)
    orange: '#E67E22',
    orangeLight: '#F39C12',
    
    // Terre cuite (alternative)
    terracotta: '#B4643C',
    
    // Bleu clair (pour variation)
    lightBlue: '#3498DB'
  }
};

// Suggestions d'utilisation
const usage = {
  headers: palette.primary.DEFAULT,
  texte: palette.primary.DEFAULT,
  boutonsPrincipaux: palette.gold.DEFAULT,
  boutonsSecondaires: palette.copper.DEFAULT,
  accentsChauds: palette.copper.light,
  
  // Pour les cartes "Événements" et "Contact"
  carteEvenements: {
    border: palette.accent.green,
    icon: palette.accent.greenLight,
    button: palette.accent.green
  },
  
  carteContact: {
    border: palette.accent.orange,
    icon: palette.accent.orangeLight,
    button: palette.accent.orange
  }
};

console.log('\n🎨 PALETTE LUCHNOS - Basée sur le logo\n');
console.log('════════════════════════════════════════\n');

console.log('📘 PRIMARY (Bleu Marine):');
console.log('  - DEFAULT: ', palette.primary.DEFAULT, '  ███████');
console.log('  - LIGHT:   ', palette.primary.light, '  ███████');
console.log('  - DARK:    ', palette.primary.dark, '  ███████\n');

console.log('🟤 COPPER (Cuivre/Bronze):');
console.log('  - DEFAULT: ', palette.copper.DEFAULT, '  ███████');
console.log('  - LIGHT:   ', palette.copper.light, '  ███████');
console.log('  - DARK:    ', palette.copper.dark, '  ███████\n');

console.log('🟡 GOLD (Doré):');
console.log('  - DEFAULT: ', palette.gold.DEFAULT, '  ███████');
console.log('  - LIGHT:   ', palette.gold.light, '  ███████');
console.log('  - DARK:    ', palette.gold.dark, '  ███████\n');

console.log('🎨 ACCENTS (Pour cartes):');
console.log('  - GREEN:      ', palette.accent.green, '  ███████ (Événements)');
console.log('  - ORANGE:     ', palette.accent.orange, '  ███████ (Contact)');
console.log('  - TERRACOTTA: ', palette.accent.terracotta, '  ███████ (Alternative)');
console.log('  - LIGHT BLUE: ', palette.accent.lightBlue, '  ███████ (Variation)\n');

console.log('════════════════════════════════════════\n');
console.log('💡 CONFIGURATION TAILWIND:\n');
console.log(`colors: {
  primary: {
    DEFAULT: '${palette.primary.DEFAULT}',
    light: '${palette.primary.light}',
    dark: '${palette.primary.dark}'
  },
  gold: {
    DEFAULT: '${palette.gold.DEFAULT}',
    light: '${palette.gold.light}',
    dark: '${palette.gold.dark}'
  },
  copper: {
    DEFAULT: '${palette.copper.DEFAULT}',
    light: '${palette.copper.light}',
    dark: '${palette.copper.dark}'
  },
  accent: {
    green: '${palette.accent.green}',
    orange: '${palette.accent.orange}',
    terracotta: '${palette.accent.terracotta}',
    lightBlue: '${palette.accent.lightBlue}'
  }
}\n`);

console.log('════════════════════════════════════════\n');
console.log('📋 SUGGESTIONS D\'APPLICATION:\n');
console.log('✅ Carte Événements:');
console.log(`   border-l-accent-green text-accent-green hover:bg-accent-green\n`);
console.log('✅ Carte Contact:');
console.log(`   border-l-accent-orange text-accent-orange hover:bg-accent-orange\n`);
console.log('════════════════════════════════════════\n');

module.exports = { palette, usage };
