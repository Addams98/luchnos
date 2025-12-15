const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ Vérification des variables d'environnement critiques
console.log('🔍 Vérification configuration...');
console.log('📍 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('📍 PORT:', PORT);
console.log('📍 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Défini' : '⚠️  Non défini');
console.log('📍 DB_HOST:', process.env.DB_HOST || 'Non défini');

// 🔒 SÉCURITÉ : Headers HTTP sécurisés avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://luchnos.onrender.com", "https://luchnos-frontend-web.onrender.com"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 🔒 SÉCURITÉ : Rate Limiting global (100 requêtes par 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP
  message: { 
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 🔒 SÉCURITÉ : Rate Limiting strict pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion par IP
  skipSuccessfulRequests: true,
  message: { 
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.' 
  }
});

// 🔒 SÉCURITÉ : Configuration CORS avec origines autorisées
const allowedOrigins = [
  'https://luchnos-frontend.onrender.com',
  'https://luchnos-frontend-web.onrender.com',
  'https://luchnos.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3001',
  'http://localhost:3002'
];

// Configuration CORS complète
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (navigation directe, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Vérifier si l'origine est autorisée
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS autorisé pour:', origin);
      return callback(null, true);
    }
    
    // Origine non autorisée
    console.log('❌ CORS bloqué pour origine:', origin);
    console.log('📋 Origines autorisées:', allowedOrigins);
    return callback(null, false); // Ne pas throw d'erreur, juste refuser
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 heures de cache pour preflight
  optionsSuccessStatus: 200 // Pour compatibilité anciens navigateurs
};

app.use(cors(corsOptions));

// 🔒 Middleware explicite pour les requêtes OPTIONS (preflight CORS)
app.options('*', cors(corsOptions));

// Middleware de parsing avec limites de taille
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes avec protection rate limiting
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/evenements', require('./routes/evenements'));
app.use('/api/livres', require('./routes/livres'));
app.use('/api/multimedia', require('./routes/multimedia'));
app.use('/api/versets', require('./routes/versets'));
app.use('/api/pensees', require('./routes/pensees'));
app.use('/api/temoignages', require('./routes/temoignages'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/presentation', require('./routes/presentation'));
app.use('/api/parametres', require('./routes/parametres'));
app.use('/api/maintenance', require('./routes/maintenance'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '🕯️ Bienvenue sur l\'API Lampe Allumée (Luchnos)' });
});

// 🔍 Route de santé pour debug CORS
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.headers.origin || 'no-origin',
      allowedOrigins: allowedOrigins
    },
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasJwtSecret: !!process.env.JWT_SECRET,
      port: PORT
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
