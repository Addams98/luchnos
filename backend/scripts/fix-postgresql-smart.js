const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'routes');

// Fonction pour corriger un fichier
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let inFunction = false;
  let functionDepth = 0;
  let resultCount = 0;
  let newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let originalLine = line;
    
    // Compter les accolades pour suivre la profondeur de fonction
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    // Détecter le début d'une fonction
    if (line.includes('async (req, res)') || line.includes('async function')) {
      inFunction = true;
      functionDepth = 0;
      resultCount = 0;
    }
    
    functionDepth += openBraces - closeBraces;
    
    // Si on sort de la fonction
    if (inFunction && functionDepth <= 0 && closeBraces > 0) {
      inFunction = false;
      resultCount = 0;
    }
    
    // Remplacer const [var] = await db.query par const result/result2/result3
    if (line.includes('const [') && line.includes('] = await db.query(')) {
      const varName = `result${resultCount > 0 ? resultCount + 1 : ''}`;
      resultCount++;
      
      // Extraire le nom de variable original
      const match = line.match(/const \[(\w+)\]/);
      if (match) {
        const oldVar = match[1];
        line = line.replace(/const \[\w+\]/, `const ${varName}`);
        
        // Chercher et remplacer toutes les références à cette variable dans les lignes suivantes
        for (let j = i + 1; j < Math.min(i + 50, lines.length); j++) {
          // Ne pas remplacer dans les commentaires
          if (!lines[j].trim().startsWith('//') && !lines[j].trim().startsWith('*')) {
            // Remplacer les références à l'ancienne variable
            lines[j] = lines[j]
              .replace(new RegExp(`\\b${oldVar}\\b(?!\\.rows)`, 'g'), `${varName}.rows`)
              .replace(new RegExp(`${varName}\\.rows\\.rows`, 'g'), `${varName}.rows`)
              .replace(new RegExp(`${varName}\\.rows\\[`, 'g'), `${varName}.rows[`);
          }
          
          // Arrêter au prochain db.query ou à la fin de la fonction
          if (lines[j].includes('await db.query(') || (lines[j].includes('}') && !lines[j].includes('{'))) {
            break;
          }
        }
      }
    }
    
    newLines.push(line);
  }
  
  return newLines.join('\n');
}

// Liste des fichiers à corriger
const files = [
  'auth.js',
  'evenements.js',
  'livres.js',
  'multimedia.js',
  'temoignages.js',
  'newsletter.js',
  'contact.js',
  'presentation.js',
  'admin.js',
  'youtube.js'
];

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    return;
  }
  
  try {
    const fixed = fixFile(filePath);
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ Corrigé: ${file}`);
  } catch (error) {
    console.error(`❌ Erreur sur ${file}:`, error.message);
  }
});

console.log('\n🎉 Correction PostgreSQL intelligente terminée!');
