const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST - S'inscrire à la newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, nom } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    
    // Vérifier si l'email existe déjà
    const existing_result = await db.query('SELECT * FROM newsletter WHERE email = $1', [email]);
    const existing = existing_result.rows;
    
    if (existing.length > 0) {
      if (existing[0].actif) {
        return res.status(400).json({ message: 'Cet email est déjà inscrit' });
      } else {
        // Réactiver l'inscription
        await db.query('UPDATE newsletter SET actif = true WHERE email = $1', [email]);
        return res.json({ message: 'Inscription réactivée avec succès!' });
      }
    }
    
    const result = await db.query(
      'INSERT INTO newsletter (email, nom) VALUES ($1, $2)',
      [email, nom || null]
    );
    res.status(201).json({ message: 'Inscription réussie! Merci de rejoindre notre communauté.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Se désinscrire de la newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await db.query('UPDATE newsletter SET actif = false WHERE email = $1', [email]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Email non trouvé' });
    }
    
    res.json({ message: 'Désinscription réussie' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer tous les abonnés actifs
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM newsletter WHERE actif = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

