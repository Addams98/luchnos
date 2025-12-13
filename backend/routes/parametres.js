const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/parametres/publics
 * @desc    Récupérer les paramètres publics (liens sociaux, etc.)
 * @access  Public
 */
router.get('/publics', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT cle, valeur FROM parametres_site 
       WHERE cle IN ('facebook_url', 'youtube_url', 'instagram_url', 'twitter_url', 'whatsapp_url', 'email_contact')
       ORDER BY cle`
    );

    console.log('Result:', result);
    console.log('Rows:', result?.rows);

    // Transformer en objet clé-valeur
    const parametres = {};
    const rows = result.rows || [];
    
    rows.forEach(param => {
      parametres[param.cle] = param.valeur || '';
    });

    res.json({
      success: true,
      data: parametres
    });
  } catch (error) {
    console.error('Erreur récupération paramètres publics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paramètres',
      error: error.message
    });
  }
});

module.exports = router;

