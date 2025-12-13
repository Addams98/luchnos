const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'luchnos_db',
  password: 'WILFRIED98',
  port: 5432,
});

async function createAdmin() {
  try {
    // Vérifier si un admin existe
    const checkResult = await pool.query("SELECT * FROM utilisateurs WHERE email = 'admin@luchnos.com'");
    
    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Admin existe déjà');
      console.log('Email:', checkResult.rows[0].email);
      console.log('Role:', checkResult.rows[0].role);
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await pool.query(
        'UPDATE utilisateurs SET password = $1 WHERE email = $2',
        [hashedPassword, 'admin@luchnos.com']
      );
      console.log('✅ Mot de passe admin mis à jour : Admin@123');
    } else {
      // Créer un nouvel admin
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await pool.query(
        "INSERT INTO utilisateurs (nom, email, password, role) VALUES ($1, $2, $3, $4)",
        ['Administrateur', 'admin@luchnos.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin créé avec succès');
      console.log('Email: admin@luchnos.com');
      console.log('Mot de passe: Admin@123');
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
