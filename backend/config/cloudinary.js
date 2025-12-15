// 📦 Configuration Cloudinary pour upload d'images sur Render
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary avec variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Vérification configuration
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

console.log('☁️  Cloudinary configuré:', isCloudinaryConfigured ? '✅' : '⚠️  Variables manquantes');

// Storage Cloudinary pour les images de livres
const cloudinaryLivresStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luchnos/livres',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 1200, crop: 'limit' }], // Optimisation taille
    public_id: (req, file) => `livre_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
});

// Storage Cloudinary pour les images d'événements
const cloudinaryEvenementsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luchnos/evenements',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
    public_id: (req, file) => `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
});

// Storage Cloudinary pour les versets (hero carousel)
const cloudinaryVersetsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luchnos/versets',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
    public_id: (req, file) => `verset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
});

// Storage Cloudinary pour les pensées du jour
const cloudinaryPenseesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luchnos/pensees',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 600, height: 600, crop: 'limit' }],
    public_id: (req, file) => `pensee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
});

// Storage Cloudinary pour les PDFs (livres téléchargeables)
const cloudinaryPDFStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'luchnos/pdfs',
    allowed_formats: ['pdf'],
    resource_type: 'raw', // Fichiers non-images
    public_id: (req, file) => `livre_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}`
  }
});

// Multer avec Cloudinary pour images de livres
const uploadLivreCloudinary = multer({
  storage: isCloudinaryConfigured ? cloudinaryLivresStorage : multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format invalide. Seules les images sont acceptées.'), false);
    }
  }
});

// Multer avec Cloudinary pour images d'événements
const uploadEvenementCloudinary = multer({
  storage: isCloudinaryConfigured ? cloudinaryEvenementsStorage : multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format invalide. Seules les images sont acceptées.'), false);
    }
  }
});

// Multer avec Cloudinary pour versets
const uploadVersetCloudinary = multer({
  storage: isCloudinaryConfigured ? cloudinaryVersetsStorage : multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format invalide. Seules les images sont acceptées.'), false);
    }
  }
});

// Multer avec Cloudinary pour pensées
const uploadPenseeCloudinary = multer({
  storage: isCloudinaryConfigured ? cloudinaryPenseesStorage : multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB (pensées plus petites)
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format invalide. Seules les images sont acceptées.'), false);
    }
  }
});

// Multer avec Cloudinary pour PDFs
const uploadPDFCloudinary = multer({
  storage: isCloudinaryConfigured ? cloudinaryPDFStorage : multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max pour PDFs
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Format invalide. Seuls les fichiers PDF sont acceptés.'), false);
    }
  }
});

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadLivreCloudinary,
  uploadEvenementCloudinary,
  uploadVersetCloudinary,
  uploadPenseeCloudinary,
  uploadPDFCloudinary
};
