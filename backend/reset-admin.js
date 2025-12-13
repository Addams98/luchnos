const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function resetAdminPassword() {
  const newPassword = 'Luchnos@2025';
  const hash = bcrypt.hashSync(newPassword, 10);
  
  try {
    console.log('🔐 Réinitialisation du mot de passe admin...\n');
    
    // Mettre à jour le mot de passe
    const result = await db.query(
      'UPDATE utilisateurs SET password = $1 WHERE email = $2 RETURNING id, nom, email, role',
      [hash, 'admin@luchnos.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Mot de passe réinitialisé avec succès!');
      console.log('\n📋 Informations du compte:');
      console.log('   Email:', result.rows[0].email);
      console.log('   Nom:', result.rows[0].nom);
      console.log('   Rôle:', result.rows[0].role);
      console.log('\n🔑 Nouveau mot de passe:', newPassword);
    } else {
      console.log('❌ Aucun utilisateur trouvé avec cet email');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
