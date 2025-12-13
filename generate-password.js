const bcrypt = require('bcryptjs');

const password = 'Luchnos@2025';
const hash = bcrypt.hashSync(password, 10);

console.log('Mot de passe:', password);
console.log('Hash bcrypt:', hash);
console.log('\nRequête SQL à exécuter sur Render:');
console.log(`UPDATE utilisateurs SET mot_de_passe = '${hash}' WHERE email = 'admin@luchnos.com';`);
