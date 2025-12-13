const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { uploadLivre, uploadPDF } = require('../config/upload');

// POST - Upload image de couverture
router.post('/upload', (req, res) => {
  uploadLivre.single('image')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload image livre:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Erreur lors de l\'upload de l\'image' 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucune image fournie' 
      });
    }
    
    const imageUrl = `/uploads/livres/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  });
});

// POST - Upload fichier PDF
router.post('/upload-pdf', (req, res) => {
  console.log('Tentative upload PDF...');
  uploadPDF.single('pdf')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload PDF:', err.message);
      console.error('Type erreur:', err.code);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Erreur lors de l\'upload du PDF' 
      });
    }
    
    if (!req.file) {
      console.error('Aucun fichier PDF reçu');
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier PDF fourni' 
      });
    }
    
    console.log('PDF uploadé:', req.file.filename);
    const pdfUrl = `/uploads/pdfs/${req.file.filename}`;
    res.json({ success: true, pdfUrl });
  });
});

// GET - Récupérer tous les livres
router.get('/', async (req, res) => {
  try {
    const rows_result = await db.query('SELECT * FROM livres ORDER BY created_at DESC');
    const rows = rows_result.rows;
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer un livre par ID
router.get('/:id', async (req, res) => {
  try {
    const rows_result = await db.query('SELECT * FROM livres WHERE id = $1', [req.params.id]);
    const rows = rows_result.rows;
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Livre non trouvé' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Récupérer les livres gratuits
router.get('/filter/gratuits', async (req, res) => {
  try {
    const rows_result = await db.query('SELECT * FROM livres WHERE gratuit = TRUE ORDER BY created_at DESC');
    const rows = rows_result.rows;
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Créer un nouveau livre
router.post('/', async (req, res) => {
  try {
    const { titre, auteur, description, image_couverture, pdf_url, nombre_pages, categorie, prix, gratuit } = req.body;
    const result = await db.query(
      'INSERT INTO livres (titre, auteur, description, image_couverture, pdf_url, nombre_pages, categorie, prix, gratuit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [titre, auteur, description, image_couverture, pdf_url, nombre_pages || 0, categorie, prix || 0, gratuit !== false]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Livre créé avec succès' });
  } catch (error) {
    console.error('Erreur création livre:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Mettre à jour un livre
router.put('/:id', async (req, res) => {
  try {
    const { titre, auteur, description, image_couverture, pdf_url, nombre_pages, categorie, prix, gratuit } = req.body;
    const result = await db.query(
      'UPDATE livres SET titre=$1, auteur=$2, description=$3, image_couverture=$4, pdf_url=$5, nombre_pages=$6, categorie=$7, prix=$8, gratuit=$9 WHERE id=$10 RETURNING *',
      [titre, auteur, description, image_couverture, pdf_url, nombre_pages, categorie, prix, gratuit, req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Livre non trouvé' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Livre mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur mise à jour livre:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer un livre
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM livres WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Livre non trouvé' });
    }
    res.json({ success: true, message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression livre:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

