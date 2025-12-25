/**
 * Script de diagnostic pour tester le login admin
 */
const db = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function testLogin() {
  console.log('🔍 Test de diagnostic du login admin\n');

  try {
    // 1. Vérifier l'utilisateur admin
    console.log('1️⃣ Recherche de l\'utilisateur admin...');
    const userResult = await db.query(
      'SELECT id, email, nom, role FROM utilisateurs WHERE email = $1',
      ['admin@luchnos.com']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Aucun utilisateur admin@luchnos.com trouvé');
      process.exit(1);
    }

    const user = userResult.rows[0];
    console.log('✅ Utilisateur trouvé:', user);

    // 2. Vérifier le mot de passe
    console.log('\n2️⃣ Vérification du mot de passe...');
    const passwordResult = await db.query(
      'SELECT password FROM utilisateurs WHERE email = $1',
      ['admin@luchnos.com']
    );
    
    const hashedPassword = passwordResult.rows[0].password;
    console.log('Hash stocké:', hashedPassword.substring(0, 20) + '...');
    
    // Tester le mot de passe
    const testPassword = 'Admin@123';
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log(`Test avec mot de passe "${testPassword}": ${isValid ? '✅ Valide' : '❌ Invalide'}`);

    // 3. Vérifier la table refresh_tokens
    console.log('\n3️⃣ Vérification de la table refresh_tokens...');
    const tokenTableResult = await db.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'refresh_tokens' 
       ORDER BY ordinal_position`
    );
    
    if (tokenTableResult.rows.length === 0) {
      console.log('❌ Table refresh_tokens introuvable !');
    } else {
      console.log('✅ Table refresh_tokens existe avec les colonnes:');
      tokenTableResult.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    }

    // 4. Vérifier les tokens existants pour l'admin
    console.log('\n4️⃣ Tokens existants pour admin...');
    const existingTokens = await db.query(
      'SELECT id, expires_at, revoked, created_at FROM refresh_tokens WHERE user_id = $1',
      [user.id]
    );
    
    if (existingTokens.rows.length === 0) {
      console.log('ℹ️ Aucun token existant');
    } else {
      console.log(`✅ ${existingTokens.rows.length} token(s) trouvé(s):`);
      existingTokens.rows.forEach(token => {
        console.log(`   - ID: ${token.id}, Expire: ${token.expires_at}, Révoqué: ${token.revoked}`);
      });
    }

    console.log('\n✅ Diagnostic terminé avec succès');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testLogin();
