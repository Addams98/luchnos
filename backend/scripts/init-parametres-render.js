const { Pool } = require('pg');

// Configuration pour Render PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://luchnos_db_user:iR0FsYI9y8gMIWC9Lsz3Y4vfEXMcwJY4@dpg-ctdiik08fa8c73c1r6dg-a.oregon-postgres.render.com/luchnos_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initParametresTable() {
  try {
    console.log('🔧 Initialisation de la table parametres_site...\n');
    
    // Créer la table si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parametres_site (
        id SERIAL PRIMARY KEY,
        cle VARCHAR(100) UNIQUE NOT NULL,
        valeur TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Table parametres_site créée ou existe déjà\n');
    
    // Vérifier si des données existent
    const result = await pool.query('SELECT COUNT(*) FROM parametres_site');
    const count = parseInt(result.rows[0].count);
    
    console.log(`📊 Nombre de paramètres existants: ${count}\n`);
    
    if (count === 0) {
      console.log('📝 Insertion des paramètres par défaut...\n');
      
      // Insérer les paramètres par défaut
      const defaultParams = [
        { cle: 'facebook_url', valeur: 'https://www.facebook.com/profile.php?id=100071922544535&mibextid=ZbWKwL', description: 'URL de la page Facebook' },
        { cle: 'youtube_url', valeur: 'https://youtube.com/@luchnoslampeallumee?si=P7dIHkQ-0sQNR-lx', description: 'URL de la chaîne YouTube' },
        { cle: 'instagram_url', valeur: 'https://instagram.com/filles2saray_nouvelle_identite?igshid=NTc4MTIwNjQ2YQ==', description: 'URL du compte Instagram' },
        { cle: 'whatsapp_url', valeur: 'https://whatsapp.com/channel/0029Va9yD32DJ6H299QykwOt', description: 'URL du canal WhatsApp' },
        { cle: 'youtube_channel_id', valeur: 'UCdLtLS7wVnyhAKQl3yfx5XQ', description: 'ID de la chaîne YouTube pour import automatique' }
      ];
      
      for (const param of defaultParams) {
        await pool.query(
          'INSERT INTO parametres_site (cle, valeur, description) VALUES ($1, $2, $3)',
          [param.cle, param.valeur, param.description]
        );
        console.log(`  ✓ ${param.cle}`);
      }
      
      console.log('\n✅ Paramètres par défaut insérés');
    }
    
    // Afficher tous les paramètres
    const allParams = await pool.query('SELECT * FROM parametres_site ORDER BY cle');
    console.log('\n📋 Paramètres actuels:');
    allParams.rows.forEach(param => {
      console.log(`  ${param.cle}: ${param.valeur}`);
    });
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

initParametresTable();
