const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://luchnos_db_user:PBMHvlHVqcPPYcvfX25H2LSdN8bBEqkl@dpg-ctcebs9u0jms73fhihf0-a.oregon-postgres.render.com/luchnos_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkVideos() {
  try {
    const result = await pool.query('SELECT id, titre, video_url, created_at FROM multimedia ORDER BY created_at DESC');
    
    console.log('Total vidéos:', result.rows.length);
    console.log('\nListe des vidéos:');
    console.log('='.repeat(80));
    
    result.rows.forEach((video, index) => {
      console.log(`\n${index + 1}. [ID: ${video.id}]`);
      console.log(`   Titre: ${video.titre}`);
      console.log(`   URL: ${video.video_url}`);
      console.log(`   Date: ${video.created_at}`);
    });

    // Vérifier les doublons
    const titres = result.rows.map(v => v.titre.toLowerCase().trim());
    const doublons = titres.filter((titre, index) => titres.indexOf(titre) !== index);
    
    if (doublons.length > 0) {
      console.log('\n\n⚠️  DOUBLONS DÉTECTÉS:');
      console.log('='.repeat(80));
      const uniqueDoublons = [...new Set(doublons)];
      uniqueDoublons.forEach(doublon => {
        const matches = result.rows.filter(v => v.titre.toLowerCase().trim() === doublon);
        console.log(`\nTitre: ${matches[0].titre}`);
        console.log(`IDs: ${matches.map(m => m.id).join(', ')}`);
      });
    }

    await pool.end();
  } catch (error) {
    console.error('Erreur:', error);
    await pool.end();
  }
}

checkVideos();
