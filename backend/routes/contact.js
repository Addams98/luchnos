const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST - Envoyer un message de contact
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;
    
    if (!nom || !email || !message) {
      return res.status(400).json({ message: 'Nom, email et message sont requis' });
    }
    
    const result = await db.query(
      'INSERT INTO contacts (nom, email, sujet, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, email, sujet || 'Contact général', message]
    );
    
    res.status(201).json({ 
      message: 'Message envoyé avec succès! Nous vous répondrons bientôt.',
      id: result.rows[0].id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer tous les messages
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Récupérer les messages non lus
router.get('/non-lus', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contacts WHERE lu = FALSE ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Marquer un message comme lu
router.put('/:id/marquer-lu', async (req, res) => {
  try {
    const result = await db.query('UPDATE contacts SET lu = TRUE WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Supprimer un message
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM contacts WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

