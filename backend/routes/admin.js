const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, editorOrAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/admin/messages
 * @desc    Récupérer tous les messages de contact
 * @access  Private (Admin/Rédacteur)
 */
router.get('/messages', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { lu, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM contacts';
    const params = [];
    let paramIndex = 1;

    if (lu !== undefined) {
      query += ` WHERE lu = $${paramIndex}`;
      params.push(lu === 'true' || lu === '1');
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const messages_result = await db.query(query, params);
    const messages = messages_result.rows;

    // Compter le total
    const countQuery = lu !== undefined 
      ? 'SELECT COUNT(*) as total FROM contacts WHERE lu = $1' 
      : 'SELECT COUNT(*) as total FROM contacts';
    const countParams = lu !== undefined ? [lu === 'true' || lu === '1'] : [];
    const total_result = await db.query(countQuery, countParams);
    const total = parseInt(total_result.rows[0].total);

    res.json({
      success: true,
      data: {
        messages,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/messages/:id
 * @desc    Récupérer un message spécifique
 * @access  Private (Admin/Rédacteur)
 */
router.get('/messages/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const messages_result = await db.query('SELECT * FROM contacts WHERE id = $1', [id]);
    const messages = messages_result.rows;

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Marquer comme lu
    await db.query('UPDATE contacts SET lu = TRUE WHERE id = $1', [id]);

    res.json({
      success: true,
      data: messages[0]
    });
  } catch (error) {
    console.error('Erreur récupération message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/messages/:id/toggle-read
 * @desc    Marquer un message comme lu/non lu
 * @access  Private (Admin/Rédacteur)
 */
router.put('/messages/:id/toggle-read', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE contacts SET lu = NOT lu WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Statut du message modifié',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur toggle read:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du statut',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/messages/:id
 * @desc    Supprimer un message
 * @access  Private (Admin/Rédacteur)
 */
router.delete('/messages/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM contacts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Statistiques du dashboard admin
 * @access  Private (Admin/Rédacteur)
 */
router.get('/stats', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    // Compter les entités
    const total_evenements_result = await db.query('SELECT COUNT(*) as total_evenements FROM evenements');
    const total_evenements = parseInt(total_evenements_result.rows[0].total_evenements);
    const total_livres_result = await db.query('SELECT COUNT(*) as total_livres FROM livres');
    const total_livres = parseInt(total_livres_result.rows[0].total_livres);
    const total_videos_result = await db.query('SELECT COUNT(*) as total_videos FROM multimedia');
    const total_videos = parseInt(total_videos_result.rows[0].total_videos);
    const total_messages_result = await db.query('SELECT COUNT(*) as total_messages FROM contacts');
    const total_messages = parseInt(total_messages_result.rows[0].total_messages);
    const messages_non_lus_result = await db.query('SELECT COUNT(*) as messages_non_lus FROM contacts WHERE lu = FALSE');
    const messages_non_lus = parseInt(messages_non_lus_result.rows[0].messages_non_lus);
    const total_newsletter_result = await db.query('SELECT COUNT(*) as total_newsletter FROM newsletter WHERE actif = TRUE');
    const total_newsletter = parseInt(total_newsletter_result.rows[0].total_newsletter);
    const total_temoignages_result = await db.query('SELECT COUNT(*) as total_temoignages FROM temoignages');
    const total_temoignages = parseInt(total_temoignages_result.rows[0].total_temoignages);
    const temoignages_en_attente_result = await db.query('SELECT COUNT(*) as temoignages_en_attente FROM temoignages WHERE approuve = FALSE');
    const temoignages_en_attente = parseInt(temoignages_en_attente_result.rows[0].temoignages_en_attente);

    // Événements à venir
    const evenements_a_venir_result = await db.query(
      `SELECT COUNT(*) as evenements_a_venir FROM evenements WHERE date_evenement >= CURRENT_DATE AND statut = 'a_venir'`
    );
    const evenements_a_venir = parseInt(evenements_a_venir_result.rows[0].evenements_a_venir);

    // Derniers messages
    const derniers_messages_result = await db.query(
      'SELECT id, nom, email, sujet, created_at, lu FROM contacts ORDER BY created_at DESC LIMIT 5'
    );
    const derniers_messages = derniers_messages_result.rows;

    // Derniers événements
    const derniers_evenements_result = await db.query(
      'SELECT id, titre, date_evenement, statut FROM evenements ORDER BY date_evenement DESC LIMIT 5'
    );
    const derniers_evenements = derniers_evenements_result.rows;

    res.json({
      success: true,
      data: {
        stats: {
          total_evenements,
          total_livres,
          total_videos,
          total_messages,
          messages_non_lus,
          total_newsletter,
          total_temoignages,
          temoignages_en_attente,
          evenements_a_venir
        },
        recent: {
          messages: derniers_messages,
          evenements: derniers_evenements
        }
      }
    });
  } catch (error) {
    console.error('Erreur stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/parametres
 * @desc    Récupérer les paramètres du site
 * @access  Private (Admin/Rédacteur)
 */
router.get('/parametres', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const parametres_result = await db.query('SELECT * FROM parametres_site ORDER BY cle');
    const parametres = parametres_result.rows;

    res.json({
      success: true,
      data: parametres
    });
  } catch (error) {
    console.error('Erreur paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paramètres',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/parametres
 * @desc    Mettre à jour plusieurs paramètres en bloc
 * @access  Private (Admin)
 */
router.put('/parametres', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { parametres } = req.body;

    if (!parametres || !Array.isArray(parametres)) {
      return res.status(400).json({
        success: false,
        message: 'Format de données invalide'
      });
    }

    // Mettre à jour chaque paramètre
    for (const param of parametres) {
      const { cle, valeur } = param;
      
      // Vérifier si le paramètre existe, sinon l'insérer
      const existingParam = await db.query(
        'SELECT id FROM parametres_site WHERE cle = $1',
        [cle]
      );

      if (existingParam.rows.length > 0) {
        await db.query(
          'UPDATE parametres_site SET valeur = $1 WHERE cle = $2',
          [valeur, cle]
        );
      } else {
        await db.query(
          'INSERT INTO parametres_site (cle, valeur, description) VALUES ($1, $2, $3)',
          [cle, valeur, param.description || '']
        );
      }
    }

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur update paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des paramètres',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/parametres/:cle
 * @desc    Mettre à jour un paramètre
 * @access  Private (Admin)
 */
router.put('/parametres/:cle', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { cle } = req.params;
    const { valeur } = req.body;

    const result = await db.query(
      'UPDATE parametres_site SET valeur = $1 WHERE cle = $2',
      [valeur, cle]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paramètre non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Paramètre mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur update paramètre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du paramètre',
      error: error.message
    });
  }
});

// ==================== ROUTES VERSETS ====================

/**
 * @route   GET /api/admin/versets
 * @desc    Récupérer tous les versets (avec inactifs pour admin)
 * @access  Private (Admin)
 */
router.get('/versets', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM versets_hero ORDER BY ordre ASC, id DESC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération versets admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des versets',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/admin/versets
 * @desc    Créer un nouveau verset
 * @access  Private (Admin)
 */
router.post('/versets', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { texte, reference, image_url, actif = true, ordre = 0 } = req.body;

    if (!texte || !reference) {
      return res.status(400).json({
        success: false,
        message: 'Le texte et la référence sont obligatoires'
      });
    }

    const result = await db.query(
      'INSERT INTO versets_hero (texte, reference, image_url, actif, ordre, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [texte, reference, image_url, actif, ordre]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Verset créé avec succès'
    });
  } catch (error) {
    console.error('Erreur création verset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du verset',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/versets/:id
 * @desc    Mettre à jour un verset
 * @access  Private (Admin)
 */
router.put('/versets/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { texte, reference, image_url, actif, ordre } = req.body;

    const result = await db.query(
      'UPDATE versets_hero SET texte = $1, reference = $2, image_url = $3, actif = $4, ordre = $5 WHERE id = $6 RETURNING *',
      [texte, reference, image_url, actif, ordre, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verset non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Verset mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur update verset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du verset',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/versets/:id/toggle-actif
 * @desc    Toggle actif/inactif d'un verset
 * @access  Private (Admin)
 */
router.put('/versets/:id/toggle-actif', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE versets_hero SET actif = NOT actif WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verset non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Statut du verset mis à jour'
    });
  } catch (error) {
    console.error('Erreur toggle verset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/versets/:id
 * @desc    Supprimer un verset
 * @access  Private (Admin)
 */
router.delete('/versets/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM versets_hero WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Verset non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Verset supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression verset:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du verset',
      error: error.message
    });
  }
});

// ==================== ROUTES PENSÉES ====================

/**
 * @route   GET /api/admin/pensees
 * @desc    Récupérer toutes les pensées (avec inactives pour admin)
 * @access  Private (Admin)
 */
router.get('/pensees', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM pensees ORDER BY ordre ASC, date_debut DESC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Erreur récupération pensées admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pensées',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/admin/pensees
 * @desc    Créer une nouvelle pensée
 * @access  Private (Admin)
 */
router.post('/pensees', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { titre, contenu, image_url, type_periode = 'semaine', date_debut, date_fin, actif = true, ordre = 0 } = req.body;

    if (!titre || !contenu) {
      return res.status(400).json({
        success: false,
        message: 'Le titre et le contenu sont obligatoires'
      });
    }

    // Convertir les chaînes vides en null
    const dateDebutValue = date_debut && date_debut !== '' ? date_debut : null;
    const dateFinValue = date_fin && date_fin !== '' ? date_fin : null;
    const imageUrlValue = image_url && image_url !== '' ? image_url : null;

    const result = await db.query(
      'INSERT INTO pensees (titre, contenu, image_url, type_periode, date_debut, date_fin, actif, ordre, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *',
      [titre, contenu, imageUrlValue, type_periode, dateDebutValue, dateFinValue, actif, ordre]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Pensée créée avec succès'
    });
  } catch (error) {
    console.error('Erreur création pensée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la pensée',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/pensees/:id
 * @desc    Mettre à jour une pensée
 * @access  Private (Admin)
 */
router.put('/pensees/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, image_url, type_periode, date_debut, date_fin, actif, ordre } = req.body;

    // Convertir les chaînes vides en null
    const dateDebutValue = date_debut && date_debut !== '' ? date_debut : null;
    const dateFinValue = date_fin && date_fin !== '' ? date_fin : null;
    const imageUrlValue = image_url && image_url !== '' ? image_url : null;

    const result = await db.query(
      'UPDATE pensees SET titre = $1, contenu = $2, image_url = $3, type_periode = $4, date_debut = $5, date_fin = $6, actif = $7, ordre = $8 WHERE id = $9 RETURNING *',
      [titre, contenu, imageUrlValue, type_periode, dateDebutValue, dateFinValue, actif, ordre, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pensée non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Pensée mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur update pensée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la pensée',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/pensees/:id/toggle-actif
 * @desc    Toggle actif/inactif d'une pensée
 * @access  Private (Admin)
 */
router.put('/pensees/:id/toggle-actif', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE pensees SET actif = NOT actif WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pensée non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Statut de la pensée mis à jour'
    });
  } catch (error) {
    console.error('Erreur toggle pensée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/admin/pensees/:id
 * @desc    Supprimer une pensée
 * @access  Private (Admin)
 */
router.delete('/pensees/:id', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM pensees WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pensée non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Pensée supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression pensée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la pensée',
      error: error.message
    });
  }
});

// ==================== ROUTES LIVRES ====================

/**
 * @route   PUT /api/admin/livres/:id/toggle-carousel
 * @desc    Toggle affichage carousel d'un livre
 * @access  Private (Admin)
 */
router.put('/livres/:id/toggle-carousel', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE livres SET afficher_carousel = NOT afficher_carousel WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Affichage carousel mis à jour'
    });
  } catch (error) {
    console.error('Erreur toggle carousel livre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
});

// ==================== ROUTES ÉVÉNEMENTS ====================

/**
 * @route   PUT /api/admin/evenements/:id/toggle-actif
 * @desc    Toggle actif/inactif d'un événement
 * @access  Private (Admin)
 */
router.put('/evenements/:id/toggle-actif', authMiddleware, editorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'UPDATE evenements SET actif = NOT actif WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Statut de l\'événement mis à jour'
    });
  } catch (error) {
    console.error('Erreur toggle événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
});

module.exports = router;


