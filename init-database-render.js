const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Connexion à la base Render
const client = new Client({
  connectionString: 'postgresql://luchnos_db_user:O5F7S2L5kf7m2QOmJOT3b1fdDcCwvbIW@dpg-d4uc6e7gi27c738m804g-a.frankfurt-postgres.render.com/luchnos_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('📡 Connexion à la base Render...');
    await client.connect();
    console.log('✅ Connecté!\n');

    // 0. Créer les tables depuis le schéma
    console.log('🗄️  Création des tables...');
    const schemaPath = path.join(__dirname, 'backend', 'config', 'postgresql-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Tables créées!\n');

    // 1. Créer l'admin
    console.log('👤 Création de l\'utilisateur admin...');
    const adminResult = await client.query(`
      INSERT INTO utilisateurs (nom, email, password, role, created_at) 
      VALUES (
        'Admin',
        'admin@luchnos.com',
        '$2a$10$8K1p/a0dL2LzfHNE5nqByu94BLqmWQ9n8xF/l8dCPU4OAK0C/pXl2',
        'admin',
        NOW()
      ) ON CONFLICT (email) DO NOTHING
      RETURNING id, nom, email, role;
    `);
    
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin créé:', adminResult.rows[0]);
    } else {
      console.log('ℹ️  Admin existe déjà');
    }

    // 2. Paramètres et liens sociaux
    console.log('\n⚙️  Configuration des paramètres...');
    const migrationPath = path.join(__dirname, 'backend', 'migrations', 'add_parametres_liens_sociaux.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    await client.query(migrationSQL);
    console.log('✅ Paramètres et liens sociaux créés');

    // 3. Vérification
    console.log('\n🔍 Vérification des données...');
    const checkAdmin = await client.query(`SELECT id, nom, email, role FROM utilisateurs WHERE role = 'admin'`);
    console.log('Admin trouvé:', checkAdmin.rows[0]);

    try {
      const checkParams = await client.query(`SELECT * FROM parametres_site LIMIT 1`);
      if (checkParams.rows[0]) {
        console.log('Paramètres:', checkParams.rows[0]);
      }
    } catch (e) {
      console.log('Paramètres: (table non utilisée)');
    }

    console.log('\n🎉 Base de données initialisée avec succès!');
    console.log('\n📝 Credentials admin:');
    console.log('   Email: admin@luchnos.com');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.detail) console.error('Détail:', error.detail);
  } finally {
    await client.end();
    console.log('\n🔌 Déconnecté');
  }
}

initDatabase();
