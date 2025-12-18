# Documentation Code - Lampe Allumée (Luchnos)

## 📋 Table des Matières
1. [Architecture Globale](#architecture-globale)
2. [Structure du Projet](#structure-du-projet)
3. [Backend - API Routes](#backend-api-routes)
4. [Frontend - Composants](#frontend-composants)
5. [Authentification & Sécurité](#authentification--sécurité)
6. [Base de Données](#base-de-données)
7. [Flows Importants](#flows-importants)

---

## 🏗️ Architecture Globale

### Stack Technologique
- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Authentification**: JWT (Access + Refresh Tokens)
- **Stockage**: Cloudinary (images) + Local (développement)
- **Déploiement**: Render (backend + frontend + PostgreSQL)

### Ports
- Backend: `5000` (local) / `443` (Render)
- Frontend: `3000` ou `5173` (local) / `443` (Render)
- PostgreSQL: `5432`

---

## 📁 Structure du Projet

```
luchnos/
├── backend/                    # API Node.js + Express
│   ├── server.js              # Point d'entrée, configuration CORS, routes
│   ├── config/                # Configuration DB, upload, Cloudinary
│   │   ├── database.js        # Pool PostgreSQL
│   │   ├── upload.js          # Multer (local)
│   │   └── cloudinary.js      # Cloudinary (production)
│   ├── middleware/            # Middlewares Express
│   │   ├── auth.js            # Vérification JWT
│   │   └── validation.js      # Validation des entrées
│   └── routes/                # Routes API
│       ├── auth.js            # Login, register, refresh token
│       ├── evenements.js      # CRUD événements
│       ├── livres.js          # CRUD livres
│       ├── multimedia.js      # CRUD vidéos
│       └── ...
├── frontend/                  # Application React
│   ├── src/
│   │   ├── App.jsx            # Router principal
│   │   ├── services/
│   │   │   └── api.js         # Axios + intercepteurs JWT
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Header.jsx     # Navigation principale
│   │   │   ├── Footer.jsx     # Pied de page
│   │   │   ├── AdminLayout.jsx # Layout admin
│   │   │   ├── ProtectedRoute.jsx # Route protégée
│   │   │   └── BackendStatus.jsx  # Détection backend down
│   │   ├── pages/             # Pages publiques
│   │   │   ├── Home.jsx
│   │   │   ├── Presentation.jsx
│   │   │   ├── Evenements.jsx
│   │   │   └── admin/         # Pages admin
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       └── ...
│   │   └── hooks/             # Hooks personnalisés
│   │       └── useAutoLogout.js # Déconnexion auto
│   └── tailwind.config.js     # Configuration Tailwind
└── uploads/                   # Fichiers uploadés (local)
```

---

## 🔌 Backend - API Routes

### 📍 Routes Authentification (`/api/auth`)

#### POST `/api/auth/login`
**Fonction**: Connexion utilisateur
```javascript
// Corps de la requête
{
  email: "admin@luchnos.com",
  password: "motdepasse"
}

// Réponse succès
{
  success: true,
  data: {
    accessToken: "eyJhbGc...",    // Expire dans 15 min
    refreshToken: "eyJhbGc...",   // Expire dans 7 jours
    user: {
      id: 1,
      email: "admin@luchnos.com",
      role: "admin"
    }
  }
}
```

#### POST `/api/auth/refresh`
**Fonction**: Rafraîchir le token d'accès
```javascript
// Corps
{ refreshToken: "eyJhbGc..." }

// Réponse
{ success: true, data: { accessToken: "nouveau_token" } }
```

#### POST `/api/auth/logout`
**Fonction**: Déconnecter + révoquer refresh token

---

### 📅 Routes Événements (`/api/evenements`)

#### GET `/api/evenements`
**Public** - Liste tous les événements
```javascript
// Réponse
{
  success: true,
  data: [
    {
      id: 1,
      titre: "Conférence 2025",
      description: "...",
      date_evenement: "2025-12-20",
      heure_evenement: "14:00",
      lieu: "Kinshasa",
      image_url: "/uploads/evenements/img.jpg",
      statut: "a_venir",  // a_venir | en_cours | termine
      type_evenement: "conference"  // conference | seminaire | culte | autre
    }
  ]
}
```

#### POST `/api/evenements` 🔒 Admin
**Fonction**: Créer un événement
```javascript
// Headers requis
Authorization: Bearer {accessToken}

// Corps
{
  titre: "Nouvel événement",
  description: "...",
  date_evenement: "2025-12-25",
  heure_evenement: "15:00",
  lieu: "Lubumbashi",
  image_url: "/uploads/evenements/uploaded.jpg",
  type_evenement: "seminaire",
  statut: "a_venir"
}
```

---

### 📚 Routes Livres (`/api/livres`)

#### GET `/api/livres`
**Public** - Liste tous les livres

#### POST `/api/livres/upload-image` 🔒 Admin
**Fonction**: Upload image de couverture
```javascript
// Form-data
image: File

// Réponse
{ success: true, imageUrl: "/uploads/livres/livre-123.jpg" }
```

#### POST `/api/livres/upload-pdf` 🔒 Admin
**Fonction**: Upload PDF du livre (si gratuit)

---

### 🎥 Routes Multimédia (`/api/multimedia`)

#### GET `/api/multimedia`
**Public** - Liste toutes les vidéos

#### POST `/api/youtube/sync` 🔒 Admin
**Fonction**: Synchroniser les vidéos depuis YouTube
- Récupère les dernières vidéos de la chaîne YouTube
- Enregistre dans la base de données
- Nécessite `YOUTUBE_API_KEY` dans `.env`

---

## 🎨 Frontend - Composants

### 🧩 Composants Réutilisables

#### `<Header />`
**Fichier**: `frontend/src/components/Header.jsx`
**Fonction**: Navigation principale avec menu responsive
- Menu desktop (lg:flex)
- Menu mobile hamburger (FaBars)
- Détecte la page active (useLocation)
- Scroll effect (bg change après 50px)

**Props**: Aucune

```jsx
<Header />
```

---

#### `<Footer />`
**Fichier**: `frontend/src/components/Footer.jsx`
**Fonction**: Pied de page avec liens et réseaux sociaux
- 4 colonnes: Logo, Navigation, Contact, Réseaux sociaux
- Charge les liens sociaux depuis l'API (`/api/parametres/publics`)

**Props**: Aucune

---

#### `<AdminLayout />`
**Fichier**: `frontend/src/components/AdminLayout.jsx`
**Fonction**: Layout pour toutes les pages admin
- Sidebar avec menu de navigation
- Détection utilisateur connecté
- Badge messages non lus
- Bouton déconnexion
- Hook `useAutoLogout` intégré

**Props**:
- `children` (ReactNode) - Contenu de la page

```jsx
<AdminLayout>
  <Dashboard />
</AdminLayout>
```

---

#### `<ProtectedRoute />`
**Fichier**: `frontend/src/components/ProtectedRoute.jsx`
**Fonction**: Protection des routes admin
- Vérifie présence du token dans localStorage
- Redirige vers `/admin/login` si non connecté
- Support migration ancien → nouveau format token

**Props**:
- `children` (ReactNode) - Composant à protéger

```jsx
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

#### `<BackendStatus />`
**Fichier**: `frontend/src/components/BackendStatus.jsx`
**Fonction**: Détecte et affiche l'état du backend
- Vérifie `/api/health` toutes les 10 secondes
- 4 états: checking, online, waking, offline
- Bandeau coloré selon l'état
- Bouton "Réessayer" si offline
- Se cache automatiquement quand online

**États**:
- 🔵 `waking`: Backend en réveil (30-60 sec)
- 🟠 `offline`: Backend inaccessible
- 🟢 `online`: Tout fonctionne (caché)

---

### 📄 Pages Principales

#### `Home.jsx`
**Route**: `/`
**Fonction**: Page d'accueil
- Hero carousel avec versets
- 4 cartes ministères (Multimédia, Édition, Événements, Contact)
- Section actualités

---

#### `Presentation.jsx`
**Route**: `/presentation`
**Fonction**: Présentation du centre missionnaire
- Hero avec icône ampoule
- 6 missions principales
- 4 compartiments (Missions, Formations, Édition, Héritage)
- Détails de chaque compartiment
- Appel à l'action

---

#### `Evenements.jsx`
**Route**: `/evenements`
**Fonction**: Liste des événements
- Filtres: Type, Statut, Recherche
- Onglets: À venir, En cours, Terminés
- Grille responsive 1-3 colonnes
- Carte événement avec image + détails

---

#### `Edition.jsx`
**Route**: `/edition`
**Fonction**: Bibliothèque de livres
- Filtres: Thème, Langue, Auteur
- Tri: Récent, Ancien, Titre, Auteur
- Grille 2-4 colonnes
- Modal détails livre
- Téléchargement PDF si gratuit

---

#### `admin/Dashboard.jsx`
**Route**: `/admin/dashboard`
**Protection**: 🔒 Admin requis
**Fonction**: Tableau de bord administrateur
- Statistiques (événements, livres, vidéos, messages)
- Graphiques
- Actions rapides

---

## 🔐 Authentification & Sécurité

### Flow d'Authentification

```
1. Login
   ↓
2. Backend vérifie email + password (argon2)
   ↓
3. Génère accessToken (15 min) + refreshToken (7 jours)
   ↓
4. Sauvegarde refreshToken dans DB
   ↓
5. Frontend stocke tokens dans localStorage
   ↓
6. Chaque requête inclut: Authorization: Bearer {accessToken}
   ↓
7. Si 401 (token expiré):
   → Tente refresh avec refreshToken
   → Si succès: nouveau accessToken
   → Si échec: déconnexion
```

### Middleware d'Authentification

**Fichier**: `backend/middleware/auth.js`

```javascript
/**
 * Vérifie le JWT dans le header Authorization
 * Ajoute req.user = { id, email, role } si valide
 * Retourne 401 si invalide ou expiré
 */
const authMiddleware = (req, res, next) => {
  // Extrait token du header "Bearer {token}"
  // Vérifie avec jwt.verify(token, JWT_SECRET)
  // Ajoute req.user pour les routes suivantes
}
```

### Protection XSS & Injection SQL

**Validation des entrées**: `backend/middleware/validation.js`
```javascript
// Express-validator pour toutes les entrées
// Règles de validation strictes
// Échappement des caractères spéciaux
```

**Requêtes préparées**: `backend/routes/*.js`
```javascript
// TOUJOURS utiliser des paramètres préparés ($1, $2, ...)
// JAMAIS de concaténation de chaînes
db.query('SELECT * FROM users WHERE id = $1', [userId]);
```

### Rate Limiting

**Global**: 100 requêtes / 15 minutes par IP
**Auth**: 5 tentatives / 15 minutes pour login

---

## 🗄️ Base de Données

### Schéma PostgreSQL

**Fichier**: `backend/config/database.sql`

#### Table `utilisateurs`
```sql
CREATE TABLE utilisateurs (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Hash argon2
  nom VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',  -- 'admin' | 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `evenements`
```sql
CREATE TABLE evenements (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_evenement DATE NOT NULL,
  heure_evenement VARCHAR(10),
  lieu VARCHAR(255),
  image_url VARCHAR(500),
  statut VARCHAR(50) DEFAULT 'a_venir',  -- a_venir | en_cours | termine
  type_evenement VARCHAR(50),  -- conference | seminaire | culte | autre
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `livres`
```sql
CREATE TABLE livres (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),  -- Couverture
  pdf_url VARCHAR(500),    -- Si gratuit
  gratuit BOOLEAN DEFAULT false,
  theme VARCHAR(100),
  langue VARCHAR(50),
  date_publication DATE,
  afficher_carousel BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `multimedia`
```sql
CREATE TABLE multimedia (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500) NOT NULL,  -- Lien YouTube embed
  thumbnail_url VARCHAR(500),
  categorie VARCHAR(100),
  auteur VARCHAR(255),
  annee_publication INTEGER,
  vues INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table `refresh_tokens`
```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES utilisateurs(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔄 Flows Importants

### 1. Upload d'Image (Admin)

```
1. Admin sélectionne une image dans le formulaire
   ↓
2. Frontend envoie FormData à /api/{resource}/upload
   Headers: { 'Content-Type': 'multipart/form-data', Authorization: Bearer {token} }
   ↓
3. Backend (Multer) reçoit le fichier
   ↓
4. Si Cloudinary configuré:
      → Upload sur Cloudinary
      → Retourne URL Cloudinary
   Sinon:
      → Sauvegarde dans uploads/
      → Retourne URL locale
   ↓
5. Frontend reçoit imageUrl
   ↓
6. Frontend envoie POST/PUT avec imageUrl dans le corps
   ↓
7. Backend sauvegarde URL en base de données
```

### 2. Déconnexion Automatique (Inactivité)

```
1. AdminLayout monte → useAutoLogout démarre
   ↓
2. Timer de 15 minutes démarre
   ↓
3. Chaque action utilisateur (souris, clavier, scroll):
      → Reset timer à 15 min
   ↓
4. Si aucune action pendant 15 min:
      → Fonction logout()
      → Clear localStorage
      → Redirect /admin/login
   ↓
5. Au chargement, vérifie last_activity:
      Si > 15 min depuis fermeture:
         → Déconnexion automatique
```

### 3. Détection Backend Down (Render Free Tier)

```
1. BackendStatus monte
   ↓
2. Tente fetch /api/health (timeout 5 sec)
   ↓
3. Si échec (error.response === null):
      → État: 'waking'
      → Affiche bandeau bleu "Réveil en cours"
      → Retry toutes les 10 secondes
   ↓
4. Backend répond après 30-60 sec:
      → État: 'online'
      → Bandeau disparaît
   ↓
5. Si toujours down après plusieurs tentatives:
      → État: 'offline'
      → Bandeau orange avec bouton "Réessayer"
```

### 4. Refresh Token Automatique

```
1. Frontend envoie requête API
   ↓
2. Backend retourne 401 { code: 'TOKEN_EXPIRED' }
   ↓
3. Intercepteur Axios détecte 401
   ↓
4. Vérifie si refreshToken existe dans localStorage
   ↓
5. Envoie POST /api/auth/refresh { refreshToken }
   ↓
6. Backend vérifie refreshToken:
      - Existe en DB?
      - Non révoqué?
      - Non expiré?
   ↓
7. Génère nouveau accessToken
   ↓
8. Frontend met à jour localStorage
   ↓
9. Réessaie la requête originale avec nouveau token
   ↓
10. Si refresh échoue:
       → Déconnexion complète
       → Redirect /admin/login
```

---

## 🚀 Déploiement

### Variables d'Environnement

**Backend (Render)**:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/luchnos_db
JWT_SECRET=votre_secret_tres_securise_changez_moi
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
YOUTUBE_API_KEY=votre_youtube_key
```

**Frontend (Render)**:
```bash
VITE_API_URL=https://luchnos.onrender.com/api
```

### Build Commands

**Backend**:
```bash
npm install
node server.js
```

**Frontend**:
```bash
npm install
npm run build
```

---

## 📝 Conventions de Code

### Nommage
- **Composants React**: PascalCase (`AdminLayout.jsx`)
- **Fonctions/Variables**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Routes API**: kebab-case (`/api/refresh-tokens`)

### Structure des Fichiers React
```javascript
// 1. Imports
import React from 'react';
import { useState } from 'react';

// 2. Composant
const MonComposant = ({ prop1, prop2 }) => {
  // 3. États
  const [state, setState] = useState(null);
  
  // 4. Effets
  useEffect(() => {}, []);
  
  // 5. Fonctions
  const handleClick = () => {};
  
  // 6. Render
  return <div></div>;
};

// 7. Export
export default MonComposant;
```

### Gestion des Erreurs Backend
```javascript
try {
  // Logique
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Erreur:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Message utilisateur',
    error: error.message 
  });
}
```

---

## 🐛 Debugging

### Logs Backend
```javascript
console.log('🔍 Debug:', variable);
console.error('❌ Erreur:', error);
console.warn('⚠️ Attention:', message);
```

### Logs Frontend
```javascript
console.log('📍 État actuel:', state);
console.log('🔗 API URL:', API_URL);
```

### Points de Vérification Communs

**CORS Errors**:
1. Vérifier `allowedOrigins` dans `server.js`
2. Vérifier que le backend répond (pas en veille)
3. Vérifier headers `Authorization`

**401 Unauthorized**:
1. Token présent dans localStorage?
2. Token expiré? (vérifier console)
3. Refresh token valide?

**500 Internal Server Error**:
1. Vérifier logs backend (Render dashboard)
2. Vérifier connexion PostgreSQL
3. Vérifier variables d'environnement

---

## 📞 Support

Pour toute question sur le code, référez-vous à cette documentation ou consultez:
- README.md (installation)
- CHARTE-GRAPHIQUE.md (design)
- RENDER-BACKEND-SLEEP.md (problème backend Render)

---

**Dernière mise à jour**: 18 décembre 2025
**Version**: 1.0.0
