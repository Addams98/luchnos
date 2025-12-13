const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function extractColors() {
  try {
    console.log('\n🎨 Extraction des couleurs du logo...\n');
    
    // Charger l'image
    const image = await loadImage('./frontend/public/logo.png');
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Dessiner l'image
    ctx.drawImage(image, 0, 0);
    
    // Obtenir les données des pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Map pour compter les couleurs
    const colorMap = new Map();
    
    // Parcourir tous les pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Ignorer les pixels transparents et quasi-transparents
      if (a < 50) continue;
      
      // Ignorer les couleurs très claires (blanc/gris clair)
      if (r > 240 && g > 240 && b > 240) continue;
      
      // Quantifier les couleurs (regrouper les couleurs similaires)
      const qr = Math.round(r / 20) * 20;
      const qg = Math.round(g / 20) * 20;
      const qb = Math.round(b / 20) * 20;
      
      const key = `${qr},${qg},${qb}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    // Trier par fréquence
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('🎨 Top 10 des couleurs du logo:\n');
    
    const palette = [];
    sortedColors.forEach(([color, count], index) => {
      const [r, g, b] = color.split(',').map(Number);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
      const percentage = ((count / (canvas.width * canvas.height)) * 100).toFixed(2);
      
      // Calculer la luminosité
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const type = brightness > 128 ? 'clair' : 'foncé';
      
      // Déterminer la teinte dominante
      let hue = '';
      if (r > g && r > b) hue = '🔴 Rouge/Orange';
      else if (g > r && g > b) hue = '🟢 Vert';
      else if (b > r && b > g) hue = '🔵 Bleu';
      else if (r > 200 && g > 150 && b < 100) hue = '🟡 Doré/Jaune';
      else if (r < 50 && g < 50 && b < 50) hue = '⚫ Noir';
      else hue = '🟤 Brun/Marron';
      
      console.log(`${index + 1}. ${hex}`);
      console.log(`   RGB: (${r}, ${g}, ${b})`);
      console.log(`   Couverture: ${percentage}%`);
      console.log(`   Type: ${type} - ${hue}`);
      console.log('');
      
      palette.push({ hex, rgb: `rgb(${r}, ${g}, ${b})`, type, hue, percentage });
    });
    
    // Suggestions de palette
    console.log('\n💡 PALETTE SUGGÉRÉE POUR LE SITE:\n');
    
    // Trouver les couleurs principales
    const darkColor = sortedColors.find(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return (r * 299 + g * 587 + b * 114) / 1000 < 100;
    });
    
    const goldColor = sortedColors.find(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return r > 200 && g > 150 && b < 100;
    });
    
    const orangeColor = sortedColors.find(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return r > 180 && g > 100 && g < 150 && b < 100;
    });
    
    if (darkColor) {
      const [r, g, b] = darkColor[0].split(',').map(Number);
      console.log(`Primary (Foncé): #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')} - Pour textes/headers`);
    }
    
    if (goldColor) {
      const [r, g, b] = goldColor[0].split(',').map(Number);
      console.log(`Gold (Accent): #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')} - Pour boutons/accents`);
    }
    
    if (orangeColor) {
      const [r, g, b] = orangeColor[0].split(',').map(Number);
      console.log(`Copper (Secondaire): #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')} - Pour éléments secondaires`);
    }
    
    console.log('\n✨ Configuration Tailwind suggérée:\n');
    console.log('colors: {');
    if (darkColor) {
      const [r, g, b] = darkColor[0].split(',').map(Number);
      console.log(`  primary: '#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}',`);
    }
    if (goldColor) {
      const [r, g, b] = goldColor[0].split(',').map(Number);
      console.log(`  gold: '#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}',`);
    }
    if (orangeColor) {
      const [r, g, b] = orangeColor[0].split(',').map(Number);
      console.log(`  copper: '#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}',`);
    }
    console.log('}\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Installation requise: npm install canvas');
  }
}

extractColors();
