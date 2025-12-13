const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { uploadPensee } = require('../config/upload');
const path = require('path');

/**
 * @route   POST /api/pensees/upload
 * @desc    Upload image pour pensée
 * @access  Private
 */
router.post('/upload', uploadPensee.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const imageUrl = `/uploads/pensees/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Erreur upload image pensée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/pensees/actifs
 * @desc    Récupérer les pensées actives (en cours de validité)
 * @access  Public
 */
router.get('/actifs', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, titre, contenu, image_url, type_periode, date_debut, date_fin, ordre 
       FROM pensees 
       WHERE actif = true 
       ORDER BY ordre ASC, date_debut DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération pensées actives:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pensées',
      error: error.message
    });
  }
});

module.exports = router;

