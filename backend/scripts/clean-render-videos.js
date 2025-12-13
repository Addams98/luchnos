const db = require('../config/database');

async function cleanVideosOnRender() {
  try {
    console.log('🚀 NETTOYAGE DES VIDÉOS SUR RENDER\n');
    console.log('='.repeat(60));
    
    await db.query('BEGIN');
    
    // Étape 1 : Supprimer les doublons
    console.log('\n🗑️  ÉTAPE 1: Suppression des doublons (IDs 51-100)');
    console.log('-'.repeat(60));
    
    const deleteResult = await db.query(
      'DELETE FROM multimedia WHERE id >= 51 AND id <= 100'
    );
    
    console.log(`✅ ${deleteResult.rowCount} vidéos supprimées\n`);
    
    // Étape 2: Corriger les caractères spéciaux
    console.log('🔧 ÉTAPE 2: Correction des caractères spéciaux');
    console.log('-'.repeat(60));
    
    // Récupérer toutes les vidéos
    const videos = await db.query('SELECT * FROM multimedia ORDER BY id');
    console.log(`📹 ${videos.rows.length} vidéos à traiter\n`);
    
    let corrected = 0;
    
    for (const video of videos.rows) {
      const cleanTitle = video.titre
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      const cleanDesc = (video.description || '')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      if (cleanTitle !== video.titre || cleanDesc !== (video.description || '')) {
        await db.query(
          'UPDATE multimedia SET titre = $1, description = $2 WHERE id = $3',
          [cleanTitle, cleanDesc, video.id]
        );
        corrected++;
        console.log(`   ✓ [${video.id}] ${cleanTitle.substring(0, 50)}...`);
      }
    }
    
    console.log(`\n✅ ${corrected} vidéos corrigées\n`);
    
    // Commit des changements
    await db.query('COMMIT');
    
    // Vérification finale
    console.log('📊 VÉRIFICATION FINALE');
    console.log('-'.repeat(60));
    
    const finalCount = await db.query('SELECT COUNT(*) as total FROM multimedia');
    const withIssues = await db.query(
      `SELECT COUNT(*) as count FROM multimedia WHERE titre LIKE '%&#%'`
    );
    
    console.log(`✅ Total de vidéos: ${finalCount.rows[0].total}`);
    console.log(`✅ Vidéos avec caractères spéciaux restants: ${withIssues.rows[0].count}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 NETTOYAGE TERMINÉ!\n');
    
    return {
      deleted: deleteResult.rowCount,
      corrected,
      total: finalCount.rows[0].total,
      withIssues: withIssues.rows[0].count
    };
    
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('\n❌ ERREUR:', error.message);
    throw error;
  }
}

// Exposer la fonction pour qu'elle soit appelable via une route
if (require.main === module) {
  cleanVideosOnRender().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = cleanVideosOnRender;
