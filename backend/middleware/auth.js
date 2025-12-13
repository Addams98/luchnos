const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'luchnos_secret_key_2024_change_in_production';

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans les headers Authorization
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token du header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification manquant' 
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré' 
      });
    }
    return res.status(500).json({ 
      success: false,
      message: 'Erreur d\'authentification',
      error: error.message 
    });
  }
};

/**
 * Middleware pour vérifier le rôle admin
 * À utiliser après authMiddleware
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Accès réservé aux administrateurs' 
    });
  }
  next();
};

/**
 * Middleware pour vérifier les rôles admin ou rédacteur
 * À utiliser après authMiddleware
 */
const editorOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'redacteur') {
    return res.status(403).json({ 
      success: false,
      message: 'Accès réservé aux administrateurs et rédacteurs' 
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminOnly,
  editorOrAdmin,
  JWT_SECRET
};
