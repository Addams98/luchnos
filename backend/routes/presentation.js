const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer tout le contenu de présentation
router.get('/contenu', async (req, res) => {
  try {
    const contenu_result = await db.query(
      'SELECT * FROM contenu_presentation WHERE actif = TRUE ORDER BY ordre ASC'
    );
    const contenu = contenu_result.rows;
    res.json({ success: true, data: contenu });
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET - Récupérer toutes les valeurs
router.get('/valeurs', async (req, res) => {
  try {
    const valeurs_result = await db.query(
      'SELECT * FROM valeurs WHERE actif = TRUE ORDER BY ordre ASC'
    );
    const valeurs = valeurs_result.rows;
    res.json({ success: true, data: valeurs });
  } catch (error) {
    console.error('Erreur lors de la récupération des valeurs:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT - Mettre à jour un contenu (admin)
router.put('/contenu/:id', async (req, res) => {
  try {
    const { titre, contenu, image_url, actif } = req.body;
    await db.query(
      'UPDATE contenu_presentation SET titre = $1, contenu = $2, image_url = $3, actif = $4 WHERE id = $5',
      [titre, contenu, image_url, actif !== undefined ? actif : true, req.params.id]
    );
    res.json({ success: true, message: 'Contenu mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST - Créer une nouvelle valeur (admin)
router.post('/valeurs', async (req, res) => {
  try {
    const { titre, description, icone, ordre, actif } = req.body;
    const result = await db.query(
      'INSERT INTO valeurs (titre, description, icone, ordre, actif) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [titre, description, icone || 'FaBible', ordre || 0, actif !== undefined ? actif : true]
    );
    res.json({ success: true, message: 'Valeur créée', id: result.rows[0].id });
  } catch (error) {
    console.error('Erreur lors de la création de la valeur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PUT - Mettre à jour une valeur (admin)
router.put('/valeurs/:id', async (req, res) => {
  try {
    const { titre, description, icone, ordre, actif } = req.body;
    await db.query(
      'UPDATE valeurs SET titre = $1, description = $2, icone = $3, ordre = $4, actif = $5 WHERE id = $6',
      [titre, description, icone, ordre, actif !== undefined ? actif : true, req.params.id]
    );
    res.json({ success: true, message: 'Valeur mise à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la valeur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE - Supprimer une valeur (admin)
router.delete('/valeurs/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM valeurs WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Valeur supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la valeur:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;

