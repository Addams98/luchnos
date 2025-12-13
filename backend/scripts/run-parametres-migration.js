const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'luchnos_db',
  password: 'WILFRIED98',
  port: 5432,
});

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_parametres_site.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Migration parametres_site exécutée avec succès');
    
    // Vérifier que la table existe
    const result = await pool.query("SELECT * FROM parametres_site");
    console.log(`✅ Table parametres_site contient ${result.rows.length} paramètres`);
    
  } catch (error) {
    console.error('❌ Erreur migration:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
