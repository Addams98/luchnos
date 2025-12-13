const { Client } = require('pg');

async function cleanVideosDB() {
  const client = new Client({
    connectionString: 'postgresql://luchnos_db_user:PBMHvlHVqcPPYcvfX25H2LSdN8bBEqkl@dpg-ctcebs9u0jms73fhihf0-a.oregon-postgres.render.com/luchnos_db',
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  await client.connect();
  
  try {
    await client.query('BEGIN');

    // Étape 1 : Supprimer les doublons (IDs 51-100)
    console.log('🧹 Suppression des doublons (IDs 51-100)...');
    const deleteResult = await client.query(
      'DELETE FROM multimedia WHERE id BETWEEN 51 AND 100'
    );
    console.log(`✅ ${deleteResult.rowCount} vidéos supprimées\n`);

    // Étape 2 : Corriger les caractères spéciaux
    console.log('🔧 Correction des caractères spéciaux...');
    
    const updateResult = await client.query(`
      UPDATE multimedia
      SET 
        titre = REPLACE(REPLACE(REPLACE(titre, '&#39;', ''''), ''', ''''), ''', ''''),
        description = REPLACE(REPLACE(REPLACE(description, '&#39;', ''''), ''', ''''), ''', '''')
      WHERE 
        titre LIKE '%&#39;%' OR titre LIKE '%'%' OR titre LIKE '%'%'
        OR description LIKE '%&#39;%' OR description LIKE '%'%' OR description LIKE '%'%'
    `);
    console.log(`✅ ${updateResult.rowCount} vidéos corrigées\n`);

    await client.query('COMMIT');
    
    // Vérification
    console.log('📊 Vidéos restantes:');
    const result = await client.query('SELECT id, titre FROM multimedia ORDER BY id');
    result.rows.forEach((video, index) => {
      console.log(`${index + 1}. [ID: ${video.id}] ${video.titre}`);
    });
    
    console.log(`\n✅ Total: ${result.rows.length} vidéos`);
    console.log('\n🎉 Nettoyage terminé avec succès!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

cleanVideosDB();
