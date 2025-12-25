const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

/**
 * @route   POST /api/setup-admin
 * @desc    Route temporaire pour créer l'administrateur initial
 * @access  Public (⚠️ À DÉSACTIVER APRÈS UTILISATION)
 */
router.post('/', async (req, res) => {
  try {
    const { email, password, secretKey } = req.body;

    // 🔒 Sécurité: Clé secrète requise pour empêcher les abus
    if (secretKey !== process.env.SETUP_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Clé secrète invalide'
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer ou mettre à jour l'admin
    const query = `
      INSERT INTO utilisateurs (nom, email, password, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, nom, email, role
    `;

    const result = await db.query(query, [
      'Administrateur Luchnos',
      email,
      hashedPassword,
      'admin'
    ]);

    console.log('✅ Admin créé/mis à jour:', email);

    res.json({
      success: true,
      message: 'Administrateur créé avec succès',
      data: {
        user: result.rows[0]
      }
    });

  } catch (error) {
    console.error('❌ Erreur création admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'administrateur',
      error: error.message
    });
  }
});

module.exports = router;
