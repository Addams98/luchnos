const jwt = require('jsonwebtoken');

// 🔒 CRITIQUE : JWT_SECRET doit être défini dans les variables d'environnement
// Ne jamais utiliser la valeur par défaut en production !
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('❌ ERREUR CRITIQUE : JWT_SECRET non défini en production !');
  process.exit(1);
}

// Fallback uniquement pour développement local
const JWT_SECRET_WITH_FALLBACK = JWT_SECRET || 'luchnos_dev_secret_DO_NOT_USE_IN_PRODUCTION';

/**
 * 🔒 Middleware d'authentification JWT amélioré
 * Vérifie l'access token dans les headers Authorization
 * Supporte les refresh tokens pour une sécurité renforcée
 */
const authMiddleware = (req, res, next) => {
  try {
    // Récupérer le token du header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification manquant',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, JWT_SECRET_WITH_FALLBACK);
    
    // 🔒 Vérifier que c'est bien un access token (pas un refresh token)
    if (decoded.type && decoded.type !== 'access') {
      return res.status(401).json({ 
        success: false,
        message: 'Type de token invalide',
        code: 'INVALID_TOKEN_TYPE'
      });
    }
    
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
        message: 'Token invalide',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
        code: 'TOKEN_EXPIRED'
      });
    }
    console.error('Erreur authMiddleware:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur d\'authentification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  JWT_SECRET: JWT_SECRET_WITH_FALLBACK
};
