const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'luchnos_db',
  password: 'WILFRIED98',
  port: 5432,
});

async function addColumn() {
  try {
    await pool.query('ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS nom VARCHAR(100)');
    console.log('✅ Colonne nom ajoutée à la table newsletter');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

addColumn();
