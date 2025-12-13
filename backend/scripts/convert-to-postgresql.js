const fs = require('fs');
const path = require('path');

// Convertir les placeholders MySQL (?) en PostgreSQL ($1, $2, ...)
function convertQuery(content) {
  let modified = content;
  
  // Remplacer les ? par $1, $2, etc.
  modified = modified.replace(/db\.query\s*\(\s*['"`]([^'"`]*?)['"`]\s*,/g, (match, query) => {
    let paramCount = 0;
    const convertedQuery = query.replace(/\?/g, () => {
      paramCount++;
      return `$${paramCount}`;
    });
    return match.replace(query, convertedQuery);
  });
  
  // Remplacer affectedRows par rowCount
  modified = modified.replace(/result\.affectedRows/g, 'result.rowCount');
  
  // Remplacer insertId par RETURNING id
  modified = modified.replace(/result\.insertId/g, 'result[0].id');
  
  return modified;
}

// Lire et convertir tous les fichiers routes
const routesDir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js') && f !== 'youtube.js');

console.log('🔄 Conversion des routes MySQL → PostgreSQL\n');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const original = content;
  content = convertQuery(content);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} converti`);
  } else {
    console.log(`⏭️  ${file} déjà à jour`);
  }
});

console.log('\n🎉 Conversion terminée!');
