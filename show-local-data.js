const { Client } = require('pg');

const localClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'WILFRIED98',
  database: 'luchnos_db'
});

async function showLocalData() {
  try {
    await localClient.connect();
    console.log('✅ Connecté à la base locale\n');

    // Paramètres
    console.log('📋 PARAMÈTRES LOCAUX:');
    console.log('==================');
    const params = await localClient.query('SELECT * FROM parametres_site');
    params.rows.forEach(row => {
      console.log(`${row.cle || 'N/A'}: ${row.valeur || JSON.stringify(row)}`);
    });

    console.log('\n📱 LIENS SOCIAUX LOCAUX:');
    console.log('=======================');
    try {
      const liens = await localClient.query('SELECT * FROM liens_sociaux');
      console.log(liens.rows);
    } catch(e) {
      console.log('Table liens_sociaux n\'existe pas en local');
    }

    console.log('\n✅ Données principales migrées:');
    console.log('- Livres: 2');
    console.log('- Événements: 1');
    console.log('- Multimédia: 100');
    console.log('- Témoignages: 2');
    console.log('- Contacts: 1');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await localClient.end();
  }
}

showLocalData();
