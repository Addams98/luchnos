const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Récupérer tous les contenus multimédia
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM multimedia ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération multimedia:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer un contenu par ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM multimedia WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }
    
    // Incrémenter le nombre de vues
    await db.query('UPDATE multimedia SET vues = vues + 1 WHERE id = $1', [req.params.id]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Erreur récupération multimedia par ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer par type
router.get('/type/:type', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM multimedia WHERE type_media = $1 ORDER BY created_at DESC', [req.params.type]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Erreur récupération multimedia par type:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Créer un nouveau contenu
router.post('/', async (req, res) => {
  try {
    const { titre, description, video_url, thumbnail_url, type_media, duree, youtube_id } = req.body;
    const result = await db.query(
      'INSERT INTO multimedia (titre, description, video_url, thumbnail_url, type_media, duree, youtube_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [titre, description, video_url, thumbnail_url, type_media, duree, youtube_id]
    );
    res.status(201).json({ success: true, id: result.rows[0].id, message: 'Contenu créé avec succès' });
  } catch (error) {
    console.error('Erreur création multimedia:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Mettre à jour un contenu
router.put('/:id', async (req, res) => {
  try {
    const { titre, description, video_url, thumbnail_url, type_media, duree, youtube_id } = req.body;
    const result = await db.query(
      'UPDATE multimedia SET titre=$1, description=$2, video_url=$3, thumbnail_url=$4, type_media=$5, duree=$6, youtube_id=$7 WHERE id=$8',
      [titre, description, video_url, thumbnail_url, type_media, duree, youtube_id, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }
    res.json({ success: true, message: 'Contenu mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur mise à jour multimedia:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer un contenu
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM multimedia WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Contenu non trouvé' });
    }
    res.json({ success: true, message: 'Contenu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression multimedia:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
