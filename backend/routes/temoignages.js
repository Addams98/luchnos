const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { temoignageValidation } = require('../middleware/validation');

// GET - Récupérer tous les témoignages approuvés
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM temoignages WHERE approuve = TRUE ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer tous les témoignages (y compris non approuvés)
router.get('/all', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM temoignages ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Créer un nouveau témoignage
router.post('/', temoignageValidation.create, async (req, res) => {
  try {
    const { nom, email, contenu } = req.body;
    const result = await db.query(
      'INSERT INTO temoignages (nom, email, temoignage, approuve) VALUES ($1, $2, $3, FALSE) RETURNING *',
      [nom, email || null, contenu]
    );
    res.status(201).json({ 
      success: true,
      id: result.rows[0].id, 
      message: 'Témoignage soumis avec succès. Il sera visible après approbation.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Approuver un témoignage
router.put('/:id/approuver', async (req, res) => {
  try {
    const result = await db.query('UPDATE temoignages SET approuve = TRUE WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Témoignage non trouvé' });
    }
    res.json({ success: true, message: 'Témoignage approuvé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer un témoignage
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM temoignages WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Témoignage non trouvé' });
    }
    res.json({ success: true, message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

