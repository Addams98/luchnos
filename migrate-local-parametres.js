const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'luchnos_db',
  user: 'postgres',
  password: 'WILFRIED98'
});

async function migrateLocalTables() {
  const client = await pool.connect();
  
  try {
    console.log('\n🔄 Migration des tables parametres_site et liens_sociaux...\n');
    
    await client.query('BEGIN');
    
    // 1. Récupérer les anciennes données
    console.log('📊 Récupération des anciennes données...');
    const oldParams = await client.query('SELECT cle, valeur FROM parametres_site');
    const paramsMap = {};
    oldParams.rows.forEach(row => {
      paramsMap[row.cle] = row.valeur;
    });
    
    console.log('Données récupérées:', Object.keys(paramsMap));
    
    // 2. Supprimer l'ancienne table
    console.log('\n🗑️  Suppression ancienne table parametres_site...');
    await client.query('DROP TABLE IF EXISTS parametres_site CASCADE');
    
    // 3. Créer la nouvelle table parametres_site
    console.log('\n📝 Création nouvelle table parametres_site...');
    await client.query(`
      CREATE TABLE parametres_site (
        id SERIAL PRIMARY KEY,
        nom_site VARCHAR(255) DEFAULT 'Lampe Allumée (Luchnos)',
        description_site TEXT,
        email_contact VARCHAR(255),
        telephone_contact VARCHAR(50),
        adresse TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 4. Insérer les données converties
    console.log('\n💾 Insertion des données...');
    await client.query(`
      INSERT INTO parametres_site (
        nom_site, 
        description_site, 
        email_contact, 
        telephone_contact, 
        adresse
      ) VALUES ($1, $2, $3, $4, $5)
    `, [
      paramsMap['site_nom'] || 'Lampe Allumée (Luchnos)',
      paramsMap['site_description'] || '',
      paramsMap['contact_email'] || '',
      paramsMap['contact_telephone'] || '',
      paramsMap['contact_adresse'] || ''
    ]);
    
    // 5. Créer la table liens_sociaux
    console.log('\n📝 Création table liens_sociaux...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS liens_sociaux (
        id SERIAL PRIMARY KEY,
        plateforme VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        actif BOOLEAN DEFAULT true,
        ordre INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 6. Insérer les liens sociaux
    console.log('\n💾 Insertion des liens sociaux...');
    const socialLinks = [
      { plateforme: 'Facebook', url: paramsMap['facebook_url'] || '', ordre: 1 },
      { plateforme: 'Twitter', url: paramsMap['twitter_url'] || '', ordre: 2 },
      { plateforme: 'YouTube', url: paramsMap['youtube_url'] || '', ordre: 3 },
      { plateforme: 'Instagram', url: paramsMap['instagram_url'] || '', ordre: 4 },
      { plateforme: 'WhatsApp', url: paramsMap['whatsapp_url'] || '', ordre: 5 }
    ];
    
    for (const link of socialLinks) {
      if (link.url) {
        await client.query(
          'INSERT INTO liens_sociaux (plateforme, url, actif, ordre) VALUES ($1, $2, $3, $4)',
          [link.plateforme, link.url, true, link.ordre]
        );
        console.log(`  ✅ ${link.plateforme}: ${link.url}`);
      }
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ Migration terminée avec succès!\n');
    
    // Vérification
    const siteCheck = await client.query('SELECT * FROM parametres_site');
    const socialCheck = await client.query('SELECT * FROM liens_sociaux WHERE actif = true ORDER BY ordre');
    
    console.log('📊 Résultat final:');
    console.log('  - parametres_site:', siteCheck.rows[0]);
    console.log('  - liens_sociaux:', socialCheck.rows.length, 'liens actifs');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Erreur migration:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateLocalTables();
