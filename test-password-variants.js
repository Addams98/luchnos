/**
 * Test de différentes variantes du mot de passe admin
 */
const db = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function testPasswords() {
  console.log('🔐 Test de différentes variantes de mot de passe\n');

  try {
    // Récupérer le hash du mot de passe
    const result = await db.query(
      'SELECT password FROM utilisateurs WHERE email = $1',
      ['admin@luchnos.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ Utilisateur admin introuvable');
      process.exit(1);
    }

    const hashedPassword = result.rows[0].password;
    
    // Liste de mots de passe à tester
    const passwordsToTest = [
      'Admin@123',
      'admin@123',
      'Admin123',
      'admin123',
      'Luchnos@2024',
      'luchnos2024',
      'Admin@Luchnos',
      'admin',
      'Admin',
      '123456',
      'password',
      'Yehoshua123',
      'Luchnos123'
    ];

    console.log('Test de', passwordsToTest.length, 'variantes...\n');

    for (const password of passwordsToTest) {
      const isValid = await bcrypt.compare(password, hashedPassword);
      const status = isValid ? '✅ VALIDE' : '❌';
      console.log(`${status} "${password}"`);
      
      if (isValid) {
        console.log('\n🎉 Mot de passe trouvé:', password);
        break;
      }
    }

    console.log('\nSi aucun mot de passe ne fonctionne, utilisez le script update-admin-password.sql');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    process.exit(0);
  }
}

testPasswords();
