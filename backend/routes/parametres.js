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

module.exports = router;

