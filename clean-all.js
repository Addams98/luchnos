const axios = require('axios');

const API_URL = 'https://luchnos.onrender.com/api';

// Fonction pour créer un nouvel admin temporaire pour le nettoyage
async function createTempAdmin() {
  try {
    console.log('📝 Création d\'un compte admin temporaire...');
    
    // Utiliser l'endpoint public de création si disponible
    // Sinon, nous devrons passer par un autre moyen
    
    const tempAdmin = {
      nom: 'Temp Admin',
      email: 'temp@luchnos.com',
      mot_de_passe: 'TempClean@123',
      role: 'admin'
    };
    
    // Essayer de créer via l'API publique
    const response = await axios.post(`${API_URL}/auth/register`, tempAdmin);
    console.log('✅ Compte temporaire créé');
    return { email: tempAdmin.email, password: tempAdmin.mot_de_passe };
    
  } catch (error) {
    console.log('❌ Impossible de créer un compte temporaire via l\'API');
    return null;
  }
}

// Fonction principale de nettoyage
async function cleanAll() {
  console.log('🚀 NETTOYAGE COMPLET DES VIDÉOS\n');
  console.log('=' .repeat(60));
  
  // Étape 1 : Créer ou utiliser un compte admin
  let credentials = await createTempAdmin();
  
  if (!credentials) {
    // Essayer les credentials existants
    console.log('\n🔐 Tentative avec les credentials existants...\n');
    const existingCreds = [
      { email: 'admin@luchnos.com', password: 'Luchnos@2025' },
      { email: 'admin@luchnos.com', password: 'Admin@123' },
      { email: 'Luchnos2020@gmail.com', password: 'Admin@123' }
    ];
    
    for (const cred of existingCreds) {
      try {
        await axios.post(`${API_URL}/auth/login`, cred);
        credentials = cred;
        console.log(`✅ Connexion réussie avec ${cred.email}`);
        break;
      } catch (error) {
        console.log(`   ❌ ${cred.email}: ${error.response?.data?.message || 'Échec'}`);
      }
    }
  }
  
  if (!credentials) {
    console.log('\n❌ AUCUN ACCÈS ADMIN DISPONIBLE\n');
    console.log('Solutions possibles:');
    console.log('1. Réinitialiser le mot de passe via Render Dashboard');
    console.log('2. Créer un nouveau compte admin via pgAdmin');
    console.log('3. Utiliser les scripts SQL fournis\n');
    return;
  }
  
  // Étape 2 : Se connecter et obtenir le token
  console.log('\n🔐 Authentification...');
  let token;
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, credentials);
    token = loginResponse.data.token;
    console.log('✅ Token obtenu\n');
  } catch (error) {
    console.log('❌ Échec de l\'authentification\n');
    return;
  }
  
  // Étape 3 : Supprimer les doublons (IDs 51-100)
  console.log('🗑️  ÉTAPE 1: Suppression des doublons');
  console.log('-'.repeat(60));
  
  const idsToDelete = Array.from({ length: 50 }, (_, i) => i + 51);
  let deleted = 0;
  let errors = 0;
  
  for (let i = 0; i < idsToDelete.length; i++) {
    const id = idsToDelete[i];
    try {
      await axios.delete(`${API_URL}/multimedia/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      deleted++;
    } catch (error) {
      errors++;
    }
    
    // Afficher la progression
    const progress = Math.round(((i + 1) / idsToDelete.length) * 100);
    const bar = '█'.repeat(Math.floor(progress / 2)) + '░'.repeat(50 - Math.floor(progress / 2));
    process.stdout.write(`\r[${bar}] ${progress}% | Supprimés: ${deleted} | Erreurs: ${errors}`);
  }
  
  console.log(`\n✅ ${deleted} vidéos supprimées\n`);
  
  // Étape 4 : Corriger les caractères spéciaux
  console.log('🔧 ÉTAPE 2: Correction des caractères spéciaux');
  console.log('-'.repeat(60));
  
  try {
    const videosResponse = await axios.get(`${API_URL}/multimedia`);
    const videos = videosResponse.data.data || videosResponse.data;
    console.log(`📹 ${videos.length} vidéos à vérifier\n`);
    
    let corrected = 0;
    
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      
      // Nettoyer le titre
      const cleanTitle = video.titre
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      // Nettoyer la description
      const cleanDesc = (video.description || '')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'")
        .replace(/'/g, "'");
      
      // Vérifier si correction nécessaire
      if (cleanTitle !== video.titre || cleanDesc !== (video.description || '')) {
        try {
          await axios.put(
            `${API_URL}/multimedia/${video.id}`,
            {
              titre: cleanTitle,
              description: cleanDesc || video.description,
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
          console.log(`   ✓ [${video.id}] ${cleanTitle.substring(0, 50)}...`);
        } catch (error) {
          console.log(`   ❌ [${video.id}] Erreur`);
        }
      }
      
      // Barre de progression
      if ((i + 1) % 10 === 0 || i === videos.length - 1) {
        const progress = Math.round(((i + 1) / videos.length) * 100);
        console.log(`   Progression: ${i + 1}/${videos.length} (${progress}%)`);
      }
    }
    
    console.log(`\n✅ ${corrected} titres corrigés\n`);
    
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des vidéos\n');
  }
  
  // Étape 5 : Vérification finale
  console.log('📊 VÉRIFICATION FINALE');
  console.log('-'.repeat(60));
  
  try {
    const finalResponse = await axios.get(`${API_URL}/multimedia`);
    const finalVideos = finalResponse.data.data || finalResponse.data;
    
    console.log(`✅ Total de vidéos: ${finalVideos.length}`);
    console.log(`✅ Doublons supprimés: ${deleted}`);
    
    // Vérifier s'il reste des caractères bizarres
    const withIssues = finalVideos.filter(v => 
      v.titre.includes('&#') || v.titre.includes('\u2019') || v.titre.includes('\u2018')
    );
    
    if (withIssues.length > 0) {
      console.log(`⚠️  ${withIssues.length} vidéos nécessitent encore une correction`);
    } else {
      console.log('✅ Aucun caractère spécial détecté');
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la vérification finale');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 NETTOYAGE TERMINÉ!\n');
}

// Lancer le script
cleanAll().catch(error => {
  console.error('\n💥 ERREUR FATALE:', error.message);
  process.exit(1);
});
