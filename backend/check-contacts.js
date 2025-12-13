const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'WILFRIED98',
  host: 'localhost',
  port: 5432,
  database: 'luchnos_db'
});

async function checkContacts() {
  try {
    const result = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='contacts' ORDER BY ordinal_position"
    );
    console.log('Structure de la table contacts:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkContacts();
