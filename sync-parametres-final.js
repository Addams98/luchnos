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

async function syncParams() {
  try {
    await localClient.connect();
    await renderClient.connect();
    console.log('✅ Connecté aux bases\n');

    // Lire tous les paramètres locaux
    const localParams = await localClient.query('SELECT * FROM parametres_site');
    const paramsMap = {};
    localParams.rows.forEach(row => {
      if (row.cle) paramsMap[row.cle] = row.valeur;
    });

    console.log('📋 Paramètres locaux trouvés:');
    console.log(paramsMap);

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
      paramsMap['site_nom'] || 'Lampe Allumée (Luchnos)',
      paramsMap['site_description'] || 'Présenter Yéhoshoua car IL revient',
      paramsMap['contact_email'] || 'Luchnos2020@gmail.com',
      paramsMap['contact_telephone'] || '+241 62562910',
      paramsMap['contact_adresse'] || 'Libreville, Gabon'
    ]);

    console.log('✅ Paramètres du site migrés!');

    // Créer/mettre à jour les liens sociaux
    console.log('\n📱 Mise à jour des liens sociaux...');
    
    const socialLinks = [
      { plateforme: 'Facebook', url: paramsMap['facebook_url'] || '', ordre: 1 },
      { plateforme: 'Twitter', url: paramsMap['twitter_url'] || '', ordre: 2 },
      { plateforme: 'YouTube', url: paramsMap['youtube_url'] || '', ordre: 3 },
      { plateforme: 'Instagram', url: paramsMap['instagram_url'] || '', ordre: 4 },
      { plateforme: 'WhatsApp', url: paramsMap['whatsapp_url'] || '', ordre: 5 }
    ];

    // Vider les liens sociaux existants
    await renderClient.query('DELETE FROM liens_sociaux');
    
    for (const link of socialLinks) {
      if (link.url) {
        await renderClient.query(`
          INSERT INTO liens_sociaux (plateforme, url, actif, ordre)
          VALUES ($1, $2, true, $3)
        `, [link.plateforme, link.url, link.ordre]);
        console.log(`   ✅ ${link.plateforme}: ${link.url.substring(0, 50)}...`);
      }
    }

    // Ajouter l'ID de chaîne YouTube si présent
    if (paramsMap['youtube_channel_id']) {
      console.log(`\n📺 YouTube Channel ID: ${paramsMap['youtube_channel_id']}`);
      console.log('   (À ajouter manuellement dans les paramètres si nécessaire)');
    }

    console.log('\n🎉 Migration des paramètres terminée!');

    // Afficher le résultat final
    console.log('\n📋 Résultat sur Render:');
    const result = await renderClient.query('SELECT * FROM parametres_site WHERE id = 1');
    console.log(result.rows[0]);

    const liens = await renderClient.query('SELECT * FROM liens_sociaux ORDER BY ordre');
    console.log('\n📱 Liens sociaux:');
    liens.rows.forEach(l => console.log(`   ${l.plateforme}: ${l.url}`));

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await localClient.end();
    await renderClient.end();
  }
}

syncParams();
