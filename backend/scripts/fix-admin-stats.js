const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, '..', 'routes', 'admin.js');
let content = fs.readFileSync(adminPath, 'utf8');

// Remplacer const [[{ variable }]] = await db.query par
// const result = await db.query(...); const variable = parseInt(result.rows[0].variable);

// Pattern pour MySQL: const [[{ varname }]] = await db.query(...)
const pattern = /const \[\[{ (\w+) }\]\] = await db\.query\(([^;]+);/gs;

content = content.replace(pattern, (match, varName, queryPart) => {
  const tempVar = `${varName}_result`;
  return `const ${tempVar} = await db.query(${queryPart};\n    const ${varName} = parseInt(${tempVar}.rows[0].${varName});`;
});

fs.writeFileSync(adminPath, content, 'utf8');
console.log('✅ Fichier admin.js corrigé pour PostgreSQL');
