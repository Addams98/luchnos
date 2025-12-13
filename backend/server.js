const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://luchnos-frontend.onrender.com', 'https://luchnos.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
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

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '🕯️ Bienvenue sur l\'API Lampe Allumée (Luchnos)' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
