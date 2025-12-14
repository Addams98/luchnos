const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authMiddleware, adminOnly, JWT_SECRET } = require('../middleware/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Rechercher l'utilisateur
    const result = await db.query(
      'SELECT * FROM utilisateurs WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Note: La colonne derniere_connexion n'existe pas dans le schéma PostgreSQL actuel
    // await db.query(
    //   'UPDATE utilisateurs SET derniere_connexion = CURRENT_TIMESTAMP WHERE id = $1',
    //   [user.id]
    // );

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Créer un nouvel utilisateur (admin uniquement)
 * @access  Private/Admin
 */
router.post('/register', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { nom, email, mot_de_passe, password, role, actif } = req.body;

    // Accepter mot_de_passe ou password
    const userPassword = mot_de_passe || password;

    // Validation
    if (!nom || !email || !userPassword) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et mot de passe requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUsersResult = await db.query(
      'SELECT id FROM utilisateurs WHERE email = $1',
      [email]
    );

    if (existingUsersResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Mapper les rôles pour compatibilité PostgreSQL (redacteur -> editor)
    let userRole = role || 'user';
    if (userRole === 'redacteur') userRole = 'editor';
    if (!['admin', 'user', 'editor'].includes(userRole)) userRole = 'user';

    // Créer l'utilisateur
    const result = await db.query(
      'INSERT INTO utilisateurs (nom, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [nom, email, hashedPassword, userRole]
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        id: result.rows[0].id,
        nom,
        email,
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir les infos de l'utilisateur connecté
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, nom, email, role, created_at FROM utilisateurs WHERE id = $1',
      [req.user.id]
    );

    if (users.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: users.rows[0]
    });
  } catch (error) {
    console.error('Erreur me:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auth/password
 * @desc    Changer son mot de passe
 * @access  Private
 */
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    // Récupérer l'utilisateur
    const users = await db.query(
      'SELECT password FROM utilisateurs WHERE id = $1',
      [req.user.id]
    );

    if (users.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe actuel
    const isValidPassword = await bcrypt.compare(currentPassword, users.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await db.query(
      'UPDATE utilisateurs SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur password:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de mot de passe',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/users
 * @desc    Liste des utilisateurs (admin uniquement)
 * @access  Private/Admin
 */
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users_result = await db.query(
      'SELECT id, nom, email, role, created_at FROM utilisateurs ORDER BY created_at DESC'
    );
    const users = users_result.rows;

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Erreur users:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Modifier un utilisateur (admin uniquement)
 * @access  Private/Admin
 */
router.put('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, role, actif, mot_de_passe, password } = req.body;

    // Mapper les rôles pour compatibilité PostgreSQL
    let userRole = role;
    if (userRole === 'redacteur') userRole = 'editor';
    if (!['admin', 'user', 'editor'].includes(userRole)) userRole = 'user';

    // Si un mot de passe est fourni, le hasher
    const userPassword = mot_de_passe || password;
    
    if (userPassword) {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const result = await db.query(
        'UPDATE utilisateurs SET nom = $1, email = $2, role = $3, password = $4 WHERE id = $5 RETURNING *',
        [nom, email, userRole, hashedPassword, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
    } else {
      const result = await db.query(
        'UPDATE utilisateurs SET nom = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
        [nom, email, userRole, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
    }

    res.json({
      success: true,
      message: 'Utilisateur modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur update user:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'utilisateur',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Supprimer un utilisateur (admin uniquement)
 * @access  Private/Admin
 */
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression de son propre compte
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const result = await db.query('DELETE FROM utilisateurs WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur delete user:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
});

module.exports = router;

