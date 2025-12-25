/**
 * Script de réinitialisation du mot de passe admin
 * Génère un nouveau hash bcrypt et met à jour la base de données
 */
const db = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  console.log('🔐 Réinitialisation du mot de passe admin\n');

  // Nouveau mot de passe
  const newPassword = 'Admin@123';
  
  try {
    // Générer le hash
    console.log('1️⃣ Génération du hash pour:', newPassword);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('✅ Hash généré:', hashedPassword.substring(0, 30) + '...\n');

    // Mettre à jour le mot de passe
    console.log('2️⃣ Mise à jour du mot de passe dans la base de données...');
    const updateResult = await db.query(
      'UPDATE utilisateurs SET password = $1 WHERE email = $2 RETURNING id, nom, email, role',
      [hashedPassword, 'admin@luchnos.com']
    );

    if (updateResult.rowCount === 0) {
      console.log('❌ Aucun utilisateur admin@luchnos.com trouvé');
      process.exit(1);
    }

    console.log('✅ Mot de passe mis à jour pour:', updateResult.rows[0]);

    // Vérifier le nouveau mot de passe
    console.log('\n3️⃣ Vérification du nouveau mot de passe...');
    const verifyResult = await db.query(
      'SELECT password FROM utilisateurs WHERE email = $1',
      ['admin@luchnos.com']
    );

    const isValid = await bcrypt.compare(newPassword, verifyResult.rows[0].password);
    
    if (isValid) {
      console.log('✅ Vérification réussie !');
      console.log('\n🎉 Mot de passe réinitialisé avec succès !');
      console.log('📧 Email: admin@luchnos.com');
      console.log('🔑 Mot de passe:', newPassword);
    } else {
      console.log('❌ Erreur lors de la vérification');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

resetAdminPassword();
