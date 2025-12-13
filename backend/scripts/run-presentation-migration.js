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
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_contenu_presentation_postgresql.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Migration contenu_presentation et valeurs exécutée avec succès');
    
    // Vérifier que les tables existent
    const result1 = await pool.query("SELECT COUNT(*) FROM contenu_presentation");
    console.log(`✅ Table contenu_presentation contient ${result1.rows[0].count} enregistrements`);
    
    const result2 = await pool.query("SELECT COUNT(*) FROM valeurs");
    console.log(`✅ Table valeurs contient ${result2.rows[0].count} enregistrements`);
    
  } catch (error) {
    console.error('❌ Erreur migration:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
