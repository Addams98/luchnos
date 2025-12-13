const express = require('express');
const router = express.Router();
const cleanVideos = require('../scripts/clean-render-videos');

// Route GET pour déclencher le nettoyage (à utiliser UNE SEULE FOIS)
router.get('/clean-videos-now', async (req, res) => {
  try {
    console.log('🚀 Nettoyage déclenché via API...');
    
    // Exécuter le nettoyage
    const result = await cleanVideos();
    
    res.json({
      success: true,
      message: 'Nettoyage des vidéos effectué avec succès',
      result
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du nettoyage',
      error: error.message
    });
  }
});

module.exports = router;
