const { Client } = require('pg');

// Connexion locale
const localClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'WILFRIED98',
  database: 'luchnos_db'
});

// Connexion Render
const renderClient = new Client({
  connectionString: 'postgresql://luchnos_db_user:O5F7S2L5kf7m2QOmJOT3b1fdDcCwvbIW@dpg-d4uc6e7gi27c738m804g-a.frankfurt-postgres.render.com/luchnos_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateData() {
  try {
    console.log('📡 Connexion aux bases de données...');
    await localClient.connect();
    console.log('✅ Connecté à la base locale');
    
    await renderClient.connect();
    console.log('✅ Connecté à la base Render\n');

    // Liste des tables à migrer
    const tables = [
      'parametres_site',
      'liens_sociaux',
      'versets_hero',
      'pensees',
      'livres',
      'evenements',
      'multimedia',
      'temoignages',
      'contacts',
      'newsletter'
    ];

    for (const table of tables) {
      try {
        console.log(`📦 Migration de ${table}...`);
        
        // Lire les données locales
        const localData = await localClient.query(`SELECT * FROM ${table}`);
        
        if (localData.rows.length === 0) {
          console.log(`   ℹ️  Aucune donnée dans ${table}\n`);
          continue;
        }

        // Vider la table sur Render (sauf utilisateurs pour garder l'admin)
        if (table !== 'utilisateurs') {
          await renderClient.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
        }

        // Insérer les données
        for (const row of localData.rows) {
          const columns = Object.keys(row).filter(key => row[key] !== undefined);
          const values = columns.map(key => row[key]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          
          const insertQuery = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING
          `;
          
          await renderClient.query(insertQuery, values);
        }

        console.log(`   ✅ ${localData.rows.length} enregistrements migrés\n`);

      } catch (error) {
        console.log(`   ⚠️  Erreur sur ${table}: ${error.message}\n`);
      }
    }

    console.log('🎉 Migration terminée!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await localClient.end();
    await renderClient.end();
    console.log('\n🔌 Déconnecté');
  }
}

migrateData();
