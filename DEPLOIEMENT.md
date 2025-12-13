# Guide de Déploiement - Luchnos

## Fichiers essentiels pour le déploiement

### Backend
- `backend/` - Code serveur Node.js/Express
- `backend/package.json` - Dépendances backend
- `backend/config/database.sql` - Schéma de base de données

### Frontend
- `frontend/` - Application React
- `frontend/package.json` - Dépendances frontend

### Configuration
- `.gitignore` - Fichiers à ignorer
- `.dockerignore` - Fichiers à exclure du build Docker
- `README.md` - Documentation principale

### Scripts de démarrage (développement local)
- `START.bat` - Démarre backend + frontend
- `start-backend.bat` - Démarre uniquement le backend
- `start-frontend.bat` - Démarre uniquement le frontend
- `setup-database.bat` / `setup-database.ps1` - Configure la base de données

## Structure simplifiée

```
luchnos/
├── backend/              # API Node.js/Express
│   ├── config/          # Configuration (DB, upload)
│   ├── middleware/      # Middlewares (auth)
│   ├── routes/          # Routes API
│   ├── uploads/         # Fichiers uploadés
│   └── server.js        # Point d'entrée
├── frontend/            # Application React
│   ├── public/          # Assets statiques
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   └── styles/      # Styles CSS
│   └── index.html
├── .gitignore
├── .dockerignore
└── README.md
```

## Prérequis de déploiement

1. **Base de données** : MySQL 5.7+
2. **Node.js** : v16+
3. **Variables d'environnement** :
   - Backend : `.env` avec DB credentials, JWT_SECRET, YOUTUBE_API_KEY
   - Frontend : Variables Vite si nécessaire

## Commandes de déploiement

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build  # Pour production
npm run dev    # Pour développement
```

## Notes importantes

- Les fichiers de documentation de développement ont été supprimés
- Les pages dupliquées (Missions.jsx, Formations.jsx) ont été consolidées en MissionsFormations.jsx
- Les fichiers backup (.bak) ont été supprimés
- Seuls les scripts essentiels sont conservés
