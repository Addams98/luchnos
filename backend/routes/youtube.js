const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const db = require('../config/database');
require('dotenv').config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// GET - Synchroniser les vidéos depuis YouTube
router.post('/sync', async (req, res) => {
  try {
    const { channelId } = req.body;
    
    if (!channelId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Channel ID requis' 
      });
    }

    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Clé API YouTube non configurée. Veuillez configurer YOUTUBE_API_KEY dans .env' 
      });
    }

    // Récupérer les 10 dernières vidéos de la chaîne
    const response = await youtube.search.list({
      part: 'id,snippet',
      channelId: channelId,
      maxResults: 10,
      order: 'date',
      type: 'video'
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.json({ 
        success: true, 
        message: 'Aucune vidéo trouvée sur cette chaîne',
        imported: 0
      });
    }

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Importer chaque vidéo dans la base de données
    for (const item of response.data.items) {
      const videoId = item.id.videoId;
      const snippet = item.snippet;

      try {
        // Vérifier si la vidéo existe déjà
        const existing = await db.query(
          'SELECT id FROM multimedia WHERE youtube_id = $1',
          [videoId]
        );

        if (existing.rows.length > 0) {
          skipped++;
          continue;
        }

        // Récupérer les détails supplémentaires de la vidéo
        const videoDetails = await youtube.videos.list({
          part: 'contentDetails,statistics',
          id: videoId
        });

        const duration = videoDetails.data.items[0]?.contentDetails?.duration || '';
        const formattedDuration = formatDuration(duration);

        // Extraire la catégorie du titre ou description (optionnel)
        const categorie = extractCategory(snippet.title, snippet.description);

        // Insérer dans la base de données
        await db.query(
          `INSERT INTO multimedia 
          (titre, description, video_url, youtube_id, type_media, duree, categorie, thumbnail_url, created_at, auteur) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            snippet.title,
            snippet.description || '',
            `https://www.youtube.com/watch?v=${videoId}`,
            videoId,
            'video',
            formattedDuration,
            categorie,
            snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
            snippet.publishedAt,
            snippet.channelTitle
          ]
        );

        imported++;
      } catch (error) {
        console.error(`Erreur import vidéo ${videoId}:`, error.message);
        errors++;
      }
    }

    res.json({ 
      success: true, 
      message: `Synchronisation terminée: ${imported} importées, ${skipped} ignorées (déjà existantes), ${errors} erreurs`,
      imported,
      skipped,
      errors,
      total: response.data.items.length
    });

  } catch (error) {
    console.error('Erreur synchronisation YouTube:', error);
    
    if (error.code === 403) {
      return res.status(403).json({ 
        success: false, 
        message: 'Clé API YouTube invalide ou quota dépassé' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la synchronisation',
      error: error.message 
    });
  }
});

// GET - Tester la connexion YouTube API
router.get('/test', async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Clé API YouTube non configurée' 
      });
    }

    // Test simple de l'API
    const response = await youtube.channels.list({
      part: 'snippet',
      mine: false,
      id: 'UCxxxxxxxxxxxxxx' // ID de test
    });

    res.json({ 
      success: true, 
      message: 'Connexion YouTube API OK',
      quota: 'Quota disponible'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur test API YouTube',
      error: error.message 
    });
  }
});

// GET - Obtenir les infos d'une chaîne
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
      return res.status(400).json({ 
        success: false, 
        message: 'Clé API YouTube non configurée' 
      });
    }

    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      id: channelId
    });

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chaîne non trouvée' 
      });
    }

    const channel = response.data.items[0];
    res.json({ 
      success: true, 
      data: {
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails?.default?.url,
        subscriberCount: channel.statistics?.subscriberCount,
        videoCount: channel.statistics?.videoCount
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur récupération infos chaîne',
      error: error.message 
    });
  }
});

// Fonction pour formater la durée ISO 8601 en format lisible
function formatDuration(isoDuration) {
  if (!isoDuration) return '';
  
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) result += `${hours}h `;
  if (minutes) result += `${minutes}min`;
  if (!hours && !minutes && seconds) result += `${seconds}s`;

  return result.trim();
}

// Fonction pour extraire une catégorie du titre/description
function extractCategory(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  
  const categories = {
    'enseignement': ['enseignement', 'étude', 'biblique', 'doctrine'],
    'prophétie': ['prophétie', 'prophétique', 'apocalypse', 'révélation'],
    'louange': ['louange', 'worship', 'adoration', 'chant'],
    'témoignage': ['témoignage', 'conversion', 'miracle'],
    'prière': ['prière', 'intercession', 'jeûne'],
    'évangélisation': ['évangélisation', 'mission', 'gospel']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'Enseignement'; // Catégorie par défaut
}

module.exports = router;

