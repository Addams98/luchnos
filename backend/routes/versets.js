const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { uploadVerset } = require('../config/upload');
const path = require('path');

/**
 * @route   POST /api/versets/upload
 * @desc    Upload image pour verset
 * @access  Private
 */
router.post('/upload', uploadVerset.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const imageUrl = `/uploads/versets/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Erreur upload image verset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/versets
 * @desc    Récupérer tous les versets actifs
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, texte, reference, image_url FROM versets_hero WHERE actif = true ORDER BY ordre ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération versets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des versets',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/versets/actifs
 * @desc    Récupérer tous les versets actifs (alias pour compatibilité)
 * @access  Public
 */
router.get('/actifs', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, texte, reference, image_url FROM versets_hero WHERE actif = true ORDER BY ordre ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération versets actifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des versets',
      error: error.message
    });
  }
});

module.exports = router;

