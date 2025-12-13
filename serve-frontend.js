const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques depuis publish
const publicPath = path.join(__dirname, 'publish');
app.use(express.static(publicPath));

// Pour toutes les routes, renvoyer index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
});
