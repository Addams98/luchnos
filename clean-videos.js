const axios = require('axios');
const readline = require('readline');

const API_URL = 'https://luchnos.onrender.com/api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function login() {
  const email = await question('Email admin: ');
  const password = await question('Mot de passe: ');
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    rl.close();
    return response.data.token;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data?.message || error.message);
    rl.close();
    process.exit(1);
  }
}

// IDs des doublons à supprimer (les plus récents, IDs 51-100)
const doublonsIds = [
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
  71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
  81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100
];

async function cleanVideos(token) {
  try {
    console.log('\n🧹 Nettoyage des vidéos en cours...\n');

    // Étape 1 : Supprimer les doublons
    console.log('📌 Étape 1 : Suppression des doublons (IDs 51-100)');
    let suppressions = 0;
    
    for (const id of doublonsIds) {
      try {
        await axios.delete(`${API_URL}/multimedia/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        suppressions++;
        process.stdout.write(`\rSupprimé: ${suppressions}/${doublonsIds.length}`);
      } catch (error) {
        console.error(`\n❌ Erreur lors de la suppression de l'ID ${id}:`, error.response?.data?.message || error.message);
      }
    }
    
    console.log(`\n✅ ${suppressions} doublons supprimés\n`);

    // Étape 2 : Récupérer les vidéos restantes
    console.log('📌 Étape 2 : Correction des caractères spéciaux');
    const response = await axios.get(`${API_URL}/multimedia`);
    const videos = response.data.data || response.data;
    
    let corrections = 0;
    
    for (const video of videos) {
      let titreCorrige = video.titre
        .replace(/&#39;/g, "'")  // HTML entity pour apostrophe
        .replace(/'/g, "'")      // Apostrophe courbe
        .replace(/'/g, "'");     // Autre variante
      
      let descriptionCorrigee = video.description
        ? video.description
            .replace(/&#39;/g, "'")
            .replace(/'/g, "'")
            .replace(/'/g, "'")
        : video.description;
      
      // Vérifier si des corrections sont nécessaires
      if (titreCorrige !== video.titre || descriptionCorrigee !== video.description) {
        try {
          await axios.put(
            `${API_URL}/multimedia/${video.id}`,
            {
              titre: titreCorrige,
              description: descriptionCorrigee || video.description,
              video_url: video.video_url,
              categorie: video.categorie,
              duree: video.duree
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          corrections++;
          console.log(`✓ [ID ${video.id}] ${titreCorrige}`);
        } catch (error) {
          console.error(`\n❌ Erreur lors de la correction de l'ID ${video.id}:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    console.log(`\n✅ ${corrections} titres corrigés`);
    console.log('\n🎉 Nettoyage terminé !');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Point d'entrée
(async () => {
  console.log('🔐 Connexion à l\'API Luchnos...');
  const token = await login();
  console.log('✅ Connecté avec succès!\n');
  await cleanVideos(token);
})();
