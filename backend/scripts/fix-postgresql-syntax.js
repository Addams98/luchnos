const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '..', 'routes');

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
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer const [variable] = await db.query par const result = await db.query
  // et ajouter .rows après
  const patterns = [
    {
      // Pattern: const [rows] = await db.query(...)
      regex: /const \[(\w+)\] = await db\.query\(/g,
      replace: 'const result = await db.query('
    },
    {
      // Pattern: success: true, data: variable (sans .rows)
      regex: /success: true,\s*data: (\w+)(?!\s*\.)/g,
      replace: 'success: true,\n      data: result.rows'
    },
    {
      // Pattern: WHERE actif = TRUE (déjà correct)
      // Pattern: WHERE actif = 1 ou actif = 0
      regex: /WHERE actif = (1|0)/g,
      replace: (match, p1) => `WHERE actif = ${p1 === '1' ? 'true' : 'false'}`
    },
    {
      // Pattern: gratuit = TRUE, approuve = TRUE (déjà correct PostgreSQL)
      // Rien à faire
    }
  ];
  
  // Appliquer les transformations de base
  content = content.replace(/const \[(\w+)\] = await db\.query\(/g, 'const result = await db.query(');
  
  // Remplacer WHERE actif = 1/0
  content = content.replace(/WHERE actif = 1/g, 'WHERE actif = true');
  content = content.replace(/WHERE actif = 0/g, 'WHERE actif = false');
  content = content.replace(/SET actif = 1/g, 'SET actif = true');
  content = content.replace(/SET actif = 0/g, 'SET actif = false');
  
  // Remplacer les variables dans les réponses
  // Ceci est complexe, donc on fait un simple remplacement pour les cas communs
  content = content.replace(/data: rows([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: users([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: messages([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: versets([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: pensees([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: evenements([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: livres([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: contenu([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: valeurs([,\s}])/g, 'data: result.rows$1');
  content = content.replace(/data: parametres([,\s}])/g, 'data: result.rows$1');
  
  // Cas spéciaux pour les vérifications
  content = content.replace(/if \(rows\.length === 0\)/g, 'if (result.rows.length === 0)');
  content = content.replace(/if \(users\.length === 0\)/g, 'if (result.rows.length === 0)');
  content = content.replace(/if \(existing\.length > 0\)/g, 'if (result.rows.length > 0)');
  content = content.replace(/if \(existingUsers\.length > 0\)/g, 'if (result.rows.length > 0)');
  
  // Accès aux propriétés: rows[0], users[0], etc.
  content = content.replace(/rows\[0\]/g, 'result.rows[0]');
  content = content.replace(/users\[0\]/g, 'result.rows[0]');
  content = content.replace(/existing\[0\]/g, 'result.rows[0]');
  content = content.replace(/existingUsers\[0\]/g, 'result.rows[0]');
  
  // Écrire le fichier modifié
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Corrigé: ${file}`);
});

console.log('\n🎉 Conversion PostgreSQL terminée!');
