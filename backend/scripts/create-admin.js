const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'WILFRIED98',
  database: process.env.DB_NAME || 'luchnos_db',
  port: process.env.DB_PORT || 5432,
});

async function createAdmin() {
  try {
    console.log('\n🔐 Création d\'un utilisateur administrateur...\n');

    // Données admin
    const adminData = {
      nom: 'Administrateur Luchnos',
      email: 'admin@luchnos.com',
      password: 'admin123', // Changez ce mot de passe !
      role: 'admin'
    };

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Insérer l'admin
    const query = `
      INSERT INTO utilisateurs (nom, email, password, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, nom, email, role
    `;

    const result = await pool.query(query, [
      adminData.nom,
      adminData.email,
      hashedPassword,
      adminData.role
    ]);

    console.log('✅ Administrateur créé avec succès!\n');
    console.log('📋 Détails de connexion:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email    : ${adminData.email}`);
    console.log(`Password : ${adminData.password}`);
    console.log(`Role     : ${result.rows[0].role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!\n');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
