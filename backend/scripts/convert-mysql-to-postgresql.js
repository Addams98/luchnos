const fs = require('fs');
const path = require('path');

/**
 * Script de conversion MySQL → PostgreSQL pour les routes
 * Transforme la syntaxe des requêtes pour être compatible PostgreSQL
 */

function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remplacer const [var] = await db.query par const var = await db.query et ajouter .rows
  content = content.replace(
    /const \[(\w+)\] = await db\.query\(/g,
    'const $1_result = await db.query('
  );
  
  // 2. Ajouter .rows aux variables de résultat
  const varNames = ['rows', 'users', 'messages', 'versets', 'pensees', 'evenements', 'livres', 
                    'contenu', 'valeurs', 'parametres', 'existing', 'existingUsers', 'result'];
  
  varNames.forEach(varName => {
    // Remplacer les références aux variables de résultat
    const regex = new RegExp(`(const ${varName}_result = await db\\.query\\([^;]+;)`, 'g');
    content = content.replace(regex, (match) => {
      const nextLines = content.substring(content.indexOf(match) + match.length, content.indexOf(match) + match.length + 500);
      
      // Ajouter la conversion .rows après la requête
      return match + `\n    const ${varName} = ${varName}_result.rows;`;
    });
  });
  
  // 3. Remplacer WHERE actif = 1/0 par true/false
  content = content.replace(/WHERE actif = 1/g, 'WHERE actif = true');
  content = content.replace(/WHERE actif = 0/g, 'WHERE actif = false');
  content = content.replace(/SET actif = 1/g, 'SET actif = true');
  content = content.replace(/SET actif = 0/g, 'SET actif = false');
  
  // 4. Remplacer CURDATE() par CURRENT_DATE
  content = content.replace(/CURDATE\(\)/g, 'CURRENT_DATE');
  
  // 5. Remplacer NOW() par CURRENT_TIMESTAMP (déjà souvent correct mais pour être sûr)
  content = content.replace(/NOW\(\)/g, 'CURRENT_TIMESTAMP');
  
  // 6. Remplacer ON DUPLICATE KEY UPDATE par ON CONFLICT (PostgreSQL)
  content = content.replace(
    /INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\) ON DUPLICATE KEY UPDATE ([^;]+)/g,
    'INSERT INTO $1 ($2) VALUES ($3) ON CONFLICT ON CONSTRAINT $1_pkey DO UPDATE SET $4'
  );
  
  // 7. Remplacer les guillemets doubles par simples dans les valeurs de colonnes
  content = content.replace(/statut = "(\w+)"/g, "statut = '$1'");
  content = content.replace(/type_evenement = "(\w+)"/g, "type_evenement = '$1'");
  
  return content;
}

const routesDir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  try {
    const converted = convertFile(filePath);
    fs.writeFileSync(filePath, converted, 'utf8');
    console.log(`✅ Converti: ${file}`);
  } catch (error) {
    console.error(`❌ Erreur sur ${file}:`, error.message);
  }
});

console.log('\n🎉 Conversion PostgreSQL terminée!');
