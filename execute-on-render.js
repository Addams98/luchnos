const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeOnRender() {
  console.log('🚀 EXÉCUTION DU NETTOYAGE SUR RENDER\n');
  console.log('='.repeat(60));
  
  const client = new Client({
    connectionString: 'postgresql://luchnos_db_user:PBMHvlHVqcPPYcvfX25H2LSdN8bBEqkl@dpg-ctcebs9u0jms73fhihf0-a.oregon-postgres.render.com/luchnos_db',
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000,
    query_timeout: 30000,
    statement_timeout: 30000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  });

  try {
    console.log('\n🔌 Connexion à Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connecté!\n');

    // Étape 1 : Supprimer les doublons
    console.log('🗑️  ÉTAPE 1: Suppression des doublons (IDs 51-100)');
    console.log('-'.repeat(60));
    
    const deleteResult = await client.query(
      'DELETE FROM multimedia WHERE id >= 51 AND id <= 100'
    );
    console.log(`✅ ${deleteResult.rowCount} vidéos supprimées\n`);

    // Étape 2: Corriger les caractères spéciaux dans les titres
    console.log('🔧 ÉTAPE 2: Correction des caractères spéciaux');
    console.log('-'.repeat(60));
    
    const updateTitres = await client.query(`
      UPDATE multimedia
      SET titre = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          titre,
          '&#39;', ''''
      ), '&#x27;', ''''
      ), '&apos;', ''''
      ), ''', ''''
      ), ''', ''''
      ), ''', '''')
    `);
    console.log(`✅ ${updateTitres.rowCount} titres traités\n`);

    // Étape 3: Corriger les descriptions
    console.log('📝 ÉTAPE 3: Correction des descriptions');
    console.log('-'.repeat(60));
    
    const updateDesc = await client.query(`
      UPDATE multimedia
      SET description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          description,
          '&#39;', ''''
      ), '&#x27;', ''''
      ), '&apos;', ''''
      ), ''', ''''
      ), ''', ''''
      ), ''', '''')
      WHERE description IS NOT NULL
    `);
    console.log(`✅ ${updateDesc.rowCount} descriptions traitées\n`);

    // Vérification finale
    console.log('📊 VÉRIFICATION FINALE');
    console.log('-'.repeat(60));
    
    const countResult = await client.query('SELECT COUNT(*) as total FROM multimedia');
    const withIssues = await client.query(`
      SELECT COUNT(*) as count FROM multimedia WHERE titre LIKE '%&#%'
    `);
    
    console.log(`✅ Total de vidéos: ${countResult.rows[0].total}`);
    console.log(`✅ Vidéos avec caractères spéciaux restants: ${withIssues.rows[0].count}`);
    
    // Afficher quelques exemples
    console.log('\n📹 Exemples de vidéos (10 premières):');
    const examples = await client.query('SELECT id, titre FROM multimedia ORDER BY id LIMIT 10');
    examples.rows.forEach(v => {
      console.log(`   [${v.id}] ${v.titre}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('🎉 NETTOYAGE RENDER TERMINÉ AVEC SUCCÈS!\n');

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('Détails:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Connexion fermée\n');
  }
}

executeOnRender();
