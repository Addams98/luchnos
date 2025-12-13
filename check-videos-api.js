const axios = require('axios');

async function checkVideos() {
  try {
    const response = await axios.get('https://luchnos.onrender.com/api/multimedia');
    const videos = response.data.data || response.data;
    
    console.log('Total vidéos:', videos.length);
    console.log('\nListe des vidéos:');
    console.log('='.repeat(80));
    
    videos.forEach((video, index) => {
      console.log(`\n${index + 1}. [ID: ${video.id}]`);
      console.log(`   Titre: ${video.titre}`);
      console.log(`   Date: ${video.date_publication || video.created_at}`);
    });

    // Vérifier les doublons
    const titres = videos.map(v => v.titre.toLowerCase().trim());
    const doublons = [];
    
    titres.forEach((titre, index) => {
      const firstIndex = titres.indexOf(titre);
      if (firstIndex !== index && !doublons.includes(titre)) {
        doublons.push(titre);
      }
    });
    
    if (doublons.length > 0) {
      console.log('\n\n⚠️  DOUBLONS DÉTECTÉS:');
      console.log('='.repeat(80));
      doublons.forEach(doublon => {
        const matches = videos.filter(v => v.titre.toLowerCase().trim() === doublon);
        console.log(`\nTitre: "${matches[0].titre}"`);
        console.log(`IDs à supprimer: ${matches.slice(1).map(m => m.id).join(', ')}`);
        console.log(`IDs complets: ${matches.map(m => m.id).join(', ')}`);
      });
    } else {
      console.log('\n\n✅ Aucun doublon détecté');
    }

    // Vérifier les caractères spéciaux
    console.log('\n\n🔍 CARACTÈRES SPÉCIAUX DANS LES TITRES:');
    console.log('='.repeat(80));
    videos.forEach(video => {
      const hasSpecialChars = /[^\x20-\x7E\u00C0-\u00FF]/.test(video.titre);
      if (hasSpecialChars) {
        console.log(`\n[ID: ${video.id}] ${video.titre}`);
        console.log(`   Octets: ${Buffer.from(video.titre).toString('hex')}`);
      }
    });

  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

checkVideos();
