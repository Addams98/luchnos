const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * @route   GET /api/parametres/publics
 * @desc    Récupérer les paramètres publics (site info + liens sociaux)
 * @access  Public
 */
router.get('/publics', async (req, res) => {
  try {
    // Récupérer les paramètres du site
    const siteResult = await db.query('SELECT * FROM parametres_site LIMIT 1');
    const site = siteResult.rows[0] || {};

    // Récupérer les liens sociaux
    const socialResult = await db.query('SELECT plateforme, url FROM liens_sociaux WHERE actif = true ORDER BY ordre');
    const socialLinks = {};
    
    socialResult.rows.forEach(link => {
      const key = link.plateforme.toLowerCase() + '_url';
      socialLinks[key] = link.url;
    });

    res.json({
      success: true,
      data: {
        nom_site: site.nom_site || '',
        description_site: site.description_site || '',
        email_contact: site.email_contact || '',
        telephone_contact: site.telephone_contact || '',
        adresse: site.adresse || '',
        ...socialLinks
      }
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

/**
 * @route   GET /api/parametres/liens-sociaux
 * @desc    Récupérer uniquement les liens sociaux
 * @access  Public
 */
router.get('/liens-sociaux', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, plateforme, url, actif FROM liens_sociaux WHERE actif = true ORDER BY ordre'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération liens sociaux:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des liens sociaux',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/parametres/init-emergency
 * @desc    Endpoint d'urgence pour initialiser la table parametres_site
 * @access  Public (TEMPORAIRE - À SUPPRIMER APRÈS UTILISATION)
 */
router.post('/init-emergency', async (req, res) => {
  try {
    console.log('🔧 Initialisation d\'urgence de parametres_site...');
    
    // Créer la table
    await db.query(`
      CREATE TABLE IF NOT EXISTS parametres_site (
        id SERIAL PRIMARY KEY,
        cle VARCHAR(100) UNIQUE NOT NULL,
        valeur TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Insérer les paramètres par défaut
    const defaultParams = [
      ['facebook_url', 'https://www.facebook.com/profile.php?id=100071922544535&mibextid=ZbWKwL', 'URL Facebook'],
      ['youtube_url', 'https://youtube.com/@luchnoslampeallumee?si=P7dIHkQ-0sQNR-lx', 'URL YouTube'],
      ['instagram_url', 'https://instagram.com/filles2saray_nouvelle_identite?igshid=NTc4MTIwNjQ2YQ==', 'URL Instagram'],
      ['whatsapp_url', 'https://whatsapp.com/channel/0029Va9yD32DJ6H299QykwOt', 'URL WhatsApp'],
      ['youtube_channel_id', 'UCdLtLS7wVnyhAKQl3yfx5XQ', 'ID YouTube Channel']
    ];
    
    for (const [cle, valeur, description] of defaultParams) {
      await db.query(
        'INSERT INTO parametres_site (cle, valeur, description) VALUES ($1, $2, $3) ON CONFLICT (cle) DO NOTHING',
        [cle, valeur, description]
      );
    }
    
    console.log('✅ Table initialisée');
    
    res.json({
      success: true,
      message: 'Table parametres_site initialisée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur init:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation',
      error: error.message
    });
  }
});

module.exports = router;

