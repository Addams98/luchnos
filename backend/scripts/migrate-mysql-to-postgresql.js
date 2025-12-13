const mysql = require('mysql2/promise');
const { Pool } = require('pg');
require('dotenv').config();

// Configuration MySQL (source)
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luchnos',
  port: 3306
};

// Configuration PostgreSQL (destination)
const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'WILFRIED98',
  database: process.env.DB_NAME || 'luchnos_db',
  port: process.env.DB_PORT || 5432,
});

// Mapping des colonnes MySQL → PostgreSQL
const columnMappings = {
  utilisateurs: {
    'mot_de_passe': 'password',
    'actif': null,  // N'existe pas dans PostgreSQL
    'derniere_connexion': null  // N'existe pas dans PostgreSQL
  },
  multimedia: {
    'categorie': null,  // N'existe pas dans PostgreSQL
    'date_publication': null,  // N'existe pas dans PostgreSQL
    'auteur': null,  // N'existe pas dans PostgreSQL
    'annee_publication': null,  // N'existe pas dans PostgreSQL
    'source': null  // N'existe pas dans PostgreSQL
  },
  contacts: {
    'telephone': null  // N'existe pas dans PostgreSQL
  }
};

async function migrateData() {
  let mysqlConnection;

  try {
    console.log('\n🔄 Migration MySQL → PostgreSQL\n');

    // Connexion MySQL
    console.log('📡 Connexion à MySQL...');
    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connecté à MySQL\n');

    // Tables à migrer
    const tables = [
      'utilisateurs',
      'versets_hero',
      'pensees',
      'evenements',
      'livres',
      'multimedia',
      'temoignages',
      'newsletter',
      'contacts'
    ];

    for (const table of tables) {
      console.log(`📦 Migration de la table: ${table}`);
      
      try {
        // Récupérer les données de MySQL
        const [rows] = await mysqlConnection.query(`SELECT * FROM ${table}`);
        
        if (rows.length === 0) {
          console.log(`   ⚠️  Table vide, passage à la suivante\n`);
          continue;
        }

        console.log(`   📊 ${rows.length} ligne(s) trouvée(s)`);

        // Adapter les données pour PostgreSQL
        for (const row of rows) {
          // Mapper les noms de colonnes
          const mappedRow = {};
          const tableMapping = columnMappings[table] || {};
          
          Object.keys(row).forEach(key => {
            // Ignorer l'ID (auto-généré par SERIAL)
            if (key === 'id') return;
            
            // Ignorer les colonnes qui n'existent pas dans PostgreSQL
            if (tableMapping[key] === null) return;
            
            // Mapper le nom de colonne si nécessaire
            const targetKey = tableMapping[key] || key;
            let value = row[key];
            
            // Convertir les valeurs booléennes
            if (typeof value === 'number' && (value === 0 || value === 1)) {
              const booleanColumns = ['actif', 'gratuit', 'afficher_carousel', 'lu', 'approuve', 
                                      'disponible_lecture', 'disponible_telechargement'];
              if (booleanColumns.includes(targetKey)) {
                value = value === 1;
              }
            }
            
            // Convertir les dates invalides
            if (value instanceof Date && value.getFullYear() < 1900) {
              value = null;
            }
            
            mappedRow[targetKey] = value;
          });

          // Construire la requête INSERT
          const columns = Object.keys(mappedRow);
          const values = columns.map(k => mappedRow[k]);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

          const insertQuery = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING
          `;

          await pgPool.query(insertQuery, values);
        }

        console.log(`   ✅ ${rows.length} ligne(s) migrée(s)\n`);

      } catch (error) {
        console.error(`   ❌ Erreur migration ${table}:`, error.message, '\n');
      }
    }

    console.log('🎉 Migration terminée avec succès!\n');

  } catch (error) {
    console.error('❌ Erreur de migration:', error.message);
  } finally {
    if (mysqlConnection) await mysqlConnection.end();
    await pgPool.end();
  }
}

// Exécuter la migration
migrateData();
