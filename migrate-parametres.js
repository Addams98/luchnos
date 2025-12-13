const { Client } = require('pg');

const localClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'WILFRIED98',
  database: 'luchnos_db'
});

const renderClient = new Client({
  connectionString: 'postgresql://luchnos_db_user:O5F7S2L5kf7m2QOmJOT3b1fdDcCwvbIW@dpg-d4uc6e7gi27c738m804g-a.frankfurt-postgres.render.com/luchnos_db',
  ssl: { rejectUnauthorized: false }
});

async function migrateParams() {
  try {
    await localClient.connect();
    await renderClient.connect();
    console.log('✅ Connecté aux bases\n');

    // Lire les paramètres locaux
    console.log('📖 Lecture des paramètres locaux...');
    const localParams = await localClient.query('SELECT * FROM parametres_site LIMIT 1');
    
    if (localParams.rows.length > 0) {
      const params = localParams.rows[0];
      console.log('Paramètres trouvés:', params);

      // Mettre à jour sur Render
      console.log('\n💾 Mise à jour sur Render...');
      await renderClient.query(`
        UPDATE parametres_site 
        SET 
          nom_site = $1,
          description_site = $2,
          email_contact = $3,
          telephone_contact = $4,
          adresse = $5
        WHERE id = 1
      `, [
        params.valeur || params.nom_site || 'Luchnos',
        params.description_site || 'Lampe Allumée',
        params.email_contact || 'contact@luchnos.com',
        params.telephone_contact || '',
        params.adresse || ''
      ]);

      console.log('✅ Paramètres migrés!');
    } else {
      console.log('ℹ️  Aucun paramètre local trouvé');
    }

    // Afficher les paramètres sur Render
    console.log('\n📋 Paramètres sur Render:');
    const renderParams = await renderClient.query('SELECT * FROM parametres_site');
    console.log(renderParams.rows[0]);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await localClient.end();
    await renderClient.end();
  }
}

migrateParams();
