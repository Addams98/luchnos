const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Configuration pour Render PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://luchnos_db_user:iR0FsYI9y8gMIWC9Lsz3Y4vfEXMcwJY4@dpg-ctdiik08fa8c73c1r6dg-a.oregon-postgres.render.com/luchnos_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function resetAdminPassword() {
  const newPassword = 'Luchnos@2025';
  const hash = bcrypt.hashSync(newPassword, 10);
  
  try {
    console.log('🔐 Connexion à la base de données Render...\n');
    
    // Vérifier la connexion
    await pool.query('SELECT NOW()');
    console.log('✅ Connecté à Render PostgreSQL\n');
    
    // Mettre à jour le mot de passe
    const result = await pool.query(
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
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await pool.end();
    process.exit(1);
  }
}

resetAdminPassword();
