const axios = require('axios');

const API_URL = 'https://luchnos.onrender.com/api';

// Liste des IDs à supprimer (doublons 51-100)
const idsToDelete = Array.from({ length: 50 }, (_, i) => i + 51);

async function cleanVideos() {
  console.log('🔐 Connexion en cours...\n');
  
  // Essayer plusieurs combinaisons email/mot de passe
  const credentials = [
    { email: 'admin@luchnos.com', password: 'Luchnos@2025' },
    { email: 'admin@luchnos.com', password: 'Admin@123' },
    { email: 'admin@luchnos.com', password: 'Luchnos2024!' }
  ];
  
  let token = null;
  
  for (const cred of credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, cred);
      token = response.data.token;
      console.log(`✅ Connecté avec ${cred.email}\n`);
      break;
    } catch (error) {
      console.log(`❌ Échec avec mot de passe: ${cred.password}`);
    }
  }
  
  if (!token) {
    console.error('\n❌ Impossible de se connecter. Veuillez vérifier les identifiants dans le fichier.\n');
    console.log('📝 Modifiez le tableau "credentials" dans clean-videos-auto.js avec le bon mot de passe.\n');
    return;
  }

  try {
    // Étape 1 : Supprimer les doublons
    console.log('🗑️  Suppression des doublons (IDs 51-100)...\n');
    let deleted = 0;
    let failed = 0;
    
    for (const id of idsToDelete) {
      try {
        await axios.delete(`${API_URL}/multimedia/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        deleted++;
        process.stdout.write(`\r  Progression: ${deleted + failed}/${idsToDelete.length} (${deleted} supprimés, ${failed} échecs)`);
      } catch (error) {
        failed++;
        process.stdout.write(`\r  Progression: ${deleted + failed}/${idsToDelete.length} (${deleted} supprimés, ${failed} échecs)`);
      }
    }
    
    console.log(`\n\n✅ ${deleted} vidéos supprimées\n`);

    // Étape 2 : Récupérer les vidéos restantes
    console.log('🔍 Récupération des vidéos restantes...');
    const response = await axios.get(`${API_URL}/multimedia`);
    const videos = response.data.data || response.data;
    console.log(`   Trouvé: ${videos.length} vidéos\n`);

    // Étape 3 : Corriger les caractères spéciaux
    console.log('🔧 Correction des caractères spéciaux...\n');
    let corrected = 0;

    for (const video of videos) {
      const originalTitle = video.titre;
      const originalDesc = video.description || '';
      
      // Corriger les caractères
      const cleanTitle = originalTitle
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      const cleanDesc = originalDesc
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");

      // Si des corrections sont nécessaires
      if (cleanTitle !== originalTitle || cleanDesc !== originalDesc) {
        try {
          await axios.put(
            `${API_URL}/multimedia/${video.id}`,
            {
              titre: cleanTitle,
              description: cleanDesc,
              video_url: video.video_url,
              categorie: video.categorie,
              duree: video.duree,
              date_publication: video.date_publication
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          corrected++;
          console.log(`  ✓ [ID ${video.id}] ${cleanTitle.substring(0, 60)}...`);
        } catch (error) {
          console.log(`  ❌ [ID ${video.id}] Erreur: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    console.log(`\n✅ ${corrected} titres corrigés`);
    
    // Vérification finale
    console.log('\n📊 Vérification finale...');
    const finalResponse = await axios.get(`${API_URL}/multimedia`);
    const finalVideos = finalResponse.data.data || finalResponse.data;
    
    console.log(`\n✅ Total final: ${finalVideos.length} vidéos`);
    console.log('\n🎉 Nettoyage terminé avec succès!\n');
    
  } catch (error) {
    console.error('\n❌ Erreur:', error.response?.data?.message || error.message);
  }
}

cleanVideos();
