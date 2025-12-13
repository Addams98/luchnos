const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { uploadEvenement } = require('../config/upload');

// POST - Upload image d'événement
router.post('/upload', uploadEvenement.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    }
    const imageUrl = `/uploads/evenements/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer tous les événements
router.get('/', async (req, res) => {
  try {
    const rows_result = await db.query('SELECT * FROM evenements ORDER BY date_evenement DESC');
    const rows = rows_result.rows;
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer un événement par ID
router.get('/:id', async (req, res) => {
  try {
    const rows_result = await db.query('SELECT * FROM evenements WHERE id = $1', [req.params.id]);
    const rows = rows_result.rows;
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer les événements à venir
router.get('/statut/a-venir', async (req, res) => {
  try {
    const rows_result = await db.query(
      `SELECT * FROM evenements WHERE statut = 'a_venir' ORDER BY date_evenement ASC`
    );
    const rows = rows_result.rows;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouvel événement
router.post('/', async (req, res) => {
  try {
    const { titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut, actif } = req.body;
    const result = await db.query(
      'INSERT INTO evenements (titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut, actif) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut || 'a_venir', actif !== undefined ? actif : true]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Événement créé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Mettre à jour un événement
router.put('/:id', async (req, res) => {
  try {
    const { titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut, actif } = req.body;
    const result = await db.query(
      'UPDATE evenements SET titre=$1, description=$2, date_evenement=$3, heure_evenement=$4, lieu=$5, image_url=$6, type_evenement=$7, statut=$8, actif=$9 WHERE id=$10 RETURNING *',
      [titre, description, date_evenement, heure_evenement, lieu, image_url, type_evenement, statut, actif, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Événement mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer un événement
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM evenements WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé' });
    }
    res.json({ success: true, message: 'Événement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

