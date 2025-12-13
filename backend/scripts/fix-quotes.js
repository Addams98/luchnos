const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer les guillemets simples imbriqués dans les requêtes SQL
  // Pattern: 'SELECT ... WHERE col = 'value' ...'
  // Solution: Utiliser des backticks pour la chaîne externe ou doubler les guillemets internes
  
  // Trouver toutes les occurrences de db.query avec guillemets simples externes
  const queryPattern = /db\.query\(\s*'([^']*(?:'[^']*'[^']*)*)'\s*(?:,|\))/g;
  
  content = content.replace(queryPattern, (match, sqlQuery) => {
    // Si la requête SQL contient des guillemets simples non échappés, utiliser des backticks
    if (sqlQuery.includes("'") && !sqlQuery.includes("\\'")) {
      // Compter les guillemets simples
      const quoteCount = (sqlQuery.match(/'/g) || []).length;
      
      // Si nombre impair, il y a un problème
      if (quoteCount > 0) {
        // Remplacer la chaîne externe par des backticks
        return match.replace(`'${sqlQuery}'`, ``${sqlQuery}``);
      }
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Vérifié: ${file}`);
});

console.log('\n🎉 Correction des guillemets terminée!');
