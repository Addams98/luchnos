const { body, param, query, validationResult } = require('express-validator');

/**
 * 🔒 Middleware pour vérifier les résultats de validation
 * Retourne une erreur 400 si validation échoue
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(err => ({
        champ: err.path,
        message: err.msg,
        valeur: err.value
      }))
    });
  }
  
  next();
};

/**
 * 🔒 Validateurs pour l'authentification
 */
const authValidation = {
  // Validation pour login
  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Mot de passe requis')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    validateRequest
  ],

  // Validation pour register
  register: [
    body('nom')
      .trim()
      .notEmpty()
      .withMessage('Nom requis')
      .isLength({ min: 2, max: 100 })
      .withMessage('Le nom doit contenir entre 2 et 100 caractères')
      .matches(/^[\p{L}\s'-]+$/u)
      .withMessage('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    body('password', 'mot_de_passe')
      .trim()
      .notEmpty()
      .withMessage('Mot de passe requis')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'),
    body('role')
      .optional()
      .isIn(['admin', 'user', 'redacteur'])
      .withMessage('Rôle invalide'),
    validateRequest
  ],

  // Validation pour changement de mot de passe
  changePassword: [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Mot de passe actuel requis'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('Nouveau mot de passe requis')
      .isLength({ min: 8 })
      .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour les livres
 */
const livreValidation = {
  create: [
    body('titre')
      .trim()
      .notEmpty()
      .withMessage('Titre requis')
      .isLength({ max: 255 })
      .withMessage('Le titre ne peut dépasser 255 caractères'),
    body('auteur')
      .trim()
      .notEmpty()
      .withMessage('Auteur requis')
      .isLength({ max: 100 })
      .withMessage('Le nom de l\'auteur ne peut dépasser 100 caractères'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage('La description ne peut dépasser 5000 caractères'),
    body('prix')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('gratuit')
      .optional()
      .isBoolean()
      .withMessage('Gratuit doit être true ou false'),
    body('statut')
      .optional()
      .isIn(['disponible', 'epuise', 'a_venir'])
      .withMessage('Statut invalide'),
    validateRequest
  ],

  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID invalide'),
    body('titre')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Le titre ne peut dépasser 255 caractères'),
    body('auteur')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Le nom de l\'auteur ne peut dépasser 100 caractères'),
    body('prix')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour les événements
 */
const evenementValidation = {
  create: [
    body('titre')
      .trim()
      .notEmpty()
      .withMessage('Titre requis')
      .isLength({ max: 255 })
      .withMessage('Le titre ne peut dépasser 255 caractères'),
    body('type_evenement')
      .isIn(['conference', 'seminaire', 'culte', 'autre'])
      .withMessage('Type d\'événement invalide'),
    body('date_debut')
      .isISO8601()
      .withMessage('Date de début invalide'),
    body('date_fin')
      .optional()
      .isISO8601()
      .withMessage('Date de fin invalide'),
    body('lieu')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Le lieu ne peut dépasser 255 caractères'),
    body('statut')
      .optional()
      .isIn(['a_venir', 'en_cours', 'termine'])
      .withMessage('Statut invalide'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour le contact
 */
const contactValidation = {
  create: [
    body('nom')
      .trim()
      .notEmpty()
      .withMessage('Nom requis')
      .isLength({ min: 2, max: 100 })
      .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    body('telephone')
      .optional()
      .trim()
      .matches(/^[\d\s+()-]+$/)
      .withMessage('Numéro de téléphone invalide'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message requis')
      .isLength({ min: 10, max: 5000 })
      .withMessage('Le message doit contenir entre 10 et 5000 caractères'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour les témoignages
 */
const temoignageValidation = {
  create: [
    body('nom')
      .trim()
      .notEmpty()
      .withMessage('Nom requis')
      .isLength({ min: 2, max: 100 })
      .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Email invalide')
      .normalizeEmail(),
    body('contenu')
      .trim()
      .notEmpty()
      .withMessage('Contenu requis')
      .isLength({ min: 20, max: 5000 })
      .withMessage('Le témoignage doit contenir entre 20 et 5000 caractères'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour les versets
 */
const versetValidation = {
  create: [
    body('verset')
      .trim()
      .notEmpty()
      .withMessage('Verset requis')
      .isLength({ max: 1000 })
      .withMessage('Le verset ne peut dépasser 1000 caractères'),
    body('reference')
      .trim()
      .notEmpty()
      .withMessage('Référence requise')
      .isLength({ max: 100 })
      .withMessage('La référence ne peut dépasser 100 caractères'),
    validateRequest
  ]
};

/**
 * 🔒 Validateurs pour les URLs (sécurité critique)
 */
const urlValidation = {
  // Valider les URLs d'images (uploads locaux ou HTTPS externes)
  imageUrl: body('image_url')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      
      // Autoriser les URLs locales d'upload
      if (value.startsWith('/uploads/')) {
        // Vérifier qu'il n'y a pas de traversée de répertoire
        if (value.includes('..') || value.includes('//')) {
          throw new Error('URL d\'image invalide : caractères dangereux détectés');
        }
        return true;
      }
      
      // Autoriser uniquement HTTPS pour les URLs externes (pas HTTP)
      if (!value.startsWith('https://')) {
        throw new Error('Les URLs d\'image externes doivent utiliser HTTPS');
      }
      
      // Valider le format URL
      try {
        const url = new URL(value);
        // Bloquer les protocoles dangereux
        if (!['https:'].includes(url.protocol)) {
          throw new Error('Protocole non autorisé');
        }
        // Bloquer les URLs vers localhost/IP privées
        const hostname = url.hostname;
        if (hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
          throw new Error('URLs vers IPs privées non autorisées');
        }
        return true;
      } catch (error) {
        throw new Error(`URL invalide : ${error.message}`);
      }
    }),
  
  // Valider les URLs de PDF
  pdfUrl: body('pdf_url')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      
      // Autoriser les URLs locales d'upload
      if (value.startsWith('/uploads/pdfs/')) {
        if (value.includes('..') || value.includes('//')) {
          throw new Error('URL de PDF invalide : caractères dangereux détectés');
        }
        // Vérifier l'extension .pdf
        if (!value.toLowerCase().endsWith('.pdf')) {
          throw new Error('Le fichier doit être un PDF (.pdf)');
        }
        return true;
      }
      
      // URLs externes HTTPS uniquement
      if (!value.startsWith('https://')) {
        throw new Error('Les URLs de PDF externes doivent utiliser HTTPS');
      }
      
      try {
        const url = new URL(value);
        if (!['https:'].includes(url.protocol)) {
          throw new Error('Protocole non autorisé');
        }
        // Bloquer IPs privées
        const hostname = url.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1' || 
            hostname.startsWith('192.168.') || hostname.startsWith('10.') ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
          throw new Error('URLs vers IPs privées non autorisées');
        }
        return true;
      } catch (error) {
        throw new Error(`URL de PDF invalide : ${error.message}`);
      }
    }),
  
  // Valider les URLs YouTube (domaine strict)
  youtubeUrl: body('video_url')
    .optional()
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      
      // Autoriser uniquement les domaines YouTube officiels
      const youtubePatterns = [
        /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
        /^https:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
        /^https:\/\/youtu\.be\/[\w-]+/
      ];
      
      const isValid = youtubePatterns.some(pattern => pattern.test(value));
      
      if (!isValid) {
        throw new Error('URL YouTube invalide. Format attendu : https://youtube.com/watch?v=... ou https://youtu.be/...');
      }
      
      // Bloquer les paramètres suspects
      if (value.includes('<script>') || value.includes('javascript:') || value.includes('data:')) {
        throw new Error('URL contient des caractères dangereux');
      }
      
      return true;
    })
};

/**
 * 🔒 Validateurs génériques
 */
const commonValidation = {
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID invalide'),
    validateRequest
  ]
};

module.exports = {
  validateRequest,
  authValidation,
  livreValidation,
  evenementValidation,
  contactValidation,
  temoignageValidation,
  versetValidation,
  urlValidation,
  commonValidation
};
