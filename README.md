# 🕯️ Lampe Allumée (Luchnos)

> **Présenter Yéhoshoua car IL revient**

Site web complet pour le ministère "Lampe Allumée (Luchnos)" - Un ministère dédié à l'évangélisation et à l'édification du corps du Christ.

## 📋 Table des Matières

- [Technologies Utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du Projet](#structure-du-projet)
- [Charte Graphique](#charte-graphique)
- [API Endpoints](#api-endpoints)

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données
- **pg** - Driver PostgreSQL pour Node.js

### Frontend
- **React.js** - Librairie UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Swiper** - Carousel

## ✨ Fonctionnalités

### Pages Principales
- ✅ **Accueil** - Hero carousel, ministères, témoignages, newsletter
- ✅ **Présentation** - Mission, vision, valeurs du ministère
- ✅ **Luchnos Multimédia** - Vidéos d'enseignements spirituels
- ✅ **Édition Plumage** - Livres chrétiens gratuits
- ✅ **Événements** - Conférences, séminaires, cultes
- ✅ **Contact** - Formulaire de contact et informations

### Fonctionnalités Backend
- 📚 Gestion complète des livres (CRUD)
- 🎥 Gestion des contenus multimédia
- 📅 Gestion des événements
- 💬 Gestion des témoignages avec approbation
- 📧 Système de newsletter
- 📨 Gestion des messages de contact

## 📦 Installation

### Prérequis
- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- Git

### 1. Cloner le projet

Le projet est déjà créé dans `C:\Luchnos`

### 2. Installer les dépendances

#### Backend
```powershell
cd C:\Luchnos\backend
npm install
```

#### Frontend
```powershell
cd C:\Luchnos\frontend
npm install
```

## ⚙️ Configuration

### 1. Installer et démarrer PostgreSQL

1. Téléchargez PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Installez PostgreSQL avec le mot de passe `WILFRIED98` pour l'utilisateur `postgres`
3. Le service PostgreSQL démarre automatiquement sur le port 5432

### 2. Créer la base de données

1. Ouvrez pgAdmin ou utilisez la ligne de commande
2. Créez une nouvelle base de données nommée `luchnos_db`
3. Importez le schéma :
```powershell
psql -U postgres -d luchnos_db -f backend\config\postgresql-schema.sql
```

### 3. Configurer les variables d'environnement

#### Backend
```powershell
cd C:\Luchnos\backend
Copy-Item .env.example .env
```

Éditez le fichier `.env` :
```env
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=WILFRIED98
DB_NAME=luchnos_db
DB_PORT=5432
```

#### Frontend
```powershell
cd C:\Luchnos\frontend
Copy-Item .env.example .env
```

Le fichier `.env` contient :
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Démarrage

### 1. Démarrer le Backend

```powershell
cd C:\Luchnos\backend
npm run dev
```

Le serveur démarre sur : **http://localhost:5000**

### 2. Démarrer le Frontend

```powershell
cd C:\Luchnos\frontend
npm run dev
```

Le site web démarre sur : **http://localhost:3000**

### 3. Accéder au site

Ouvrez votre navigateur et allez à : **http://localhost:3000**

## 📁 Structure du Projet

```
C:\Luchnos\
├── backend/
│   ├── config/
│   │   ├── database.js          # Configuration PostgreSQL
│   │   └── postgresql-schema.sql # Schéma PostgreSQL
│   ├── routes/
│   │   ├── evenements.js        # Routes événements
│   │   ├── livres.js            # Routes livres
│   │   ├── multimedia.js        # Routes multimédia
│   │   ├── temoignages.js       # Routes témoignages
│   │   ├── newsletter.js        # Routes newsletter
│   │   └── contact.js           # Routes contact
│   ├── .env                     # Variables d'environnement
│   ├── server.js                # Point d'entrée serveur
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/              # Images et ressources
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx       # En-tête
│   │   │   ├── Footer.jsx       # Pied de page
│   │   │   ├── HeroCarousel.jsx # Carousel hero
│   │   │   ├── NewsletterSection.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Page d'accueil
│   │   │   ├── Presentation.jsx # Présentation
│   │   │   ├── Multimedia.jsx   # Multimédia
│   │   │   ├── Edition.jsx      # Édition Plumage
│   │   │   ├── Evenements.jsx   # Événements
│   │   │   └── Contact.jsx      # Contact
│   │   ├── services/
│   │   │   └── api.js           # Services API
│   │   ├── App.jsx              # Composant principal
│   │   ├── main.jsx             # Point d'entrée
│   │   └── index.css            # Styles globaux
│   ├── .env                     # Variables d'environnement
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🎨 Charte Graphique

### Palette de Couleurs

#### Couleurs Primaires
- **Bleu Marine Foncé** : `#1e293b` (slate-800/900)
  - Headers, footers, sections principales
  - Couleur dominante pour le texte
  
- **Doré/Jaune** : `#fbbf24` (yellow-400) et `#d97706` (yellow-600)
  - Couleur d'accent principale
  - Boutons, liens, éléments interactifs

#### Couleurs Secondaires
- **Tons Cuivrés** : `#ea580c` (orange-600) et `#dc2626` (red-600)
  - Accents et détails
  - Gradients décoratifs
  
- **Gris Ardoise** : `#64748b` (slate-500) et `#f1f5f9` (slate-100)
  - Textes secondaires
  - Arrière-plans neutres

#### Couleurs Fonctionnelles
- **Blanc** : `#ffffff` - Texte sur fonds sombres
- **Vert** : `#16a34a` (green-600) - Statuts positifs
- **Bleu** : `#2563eb` (blue-600) - Liens, états actifs

### Typographie
- **Police principale** : Inter (Google Fonts)
- **Police secondaire** : Georgia (serif)

### Classes Tailwind Personnalisées

```css
.btn-primary        /* Bouton principal doré */
.btn-secondary      /* Bouton secondaire bleu marine */
.btn-outline        /* Bouton bordure dorée */
.card               /* Carte avec ombre et hover */
.section-title      /* Titre de section */
.link-gold          /* Lien doré */
```

## 🔌 API Endpoints

### Événements
- `GET /api/evenements` - Tous les événements
- `GET /api/evenements/:id` - Un événement
- `GET /api/evenements/statut/a-venir` - Événements à venir
- `POST /api/evenements` - Créer un événement
- `PUT /api/evenements/:id` - Modifier un événement
- `DELETE /api/evenements/:id` - Supprimer un événement

### Livres
- `GET /api/livres` - Tous les livres
- `GET /api/livres/:id` - Un livre
- `GET /api/livres/filter/gratuits` - Livres gratuits
- `POST /api/livres` - Créer un livre
- `PUT /api/livres/:id` - Modifier un livre
- `DELETE /api/livres/:id` - Supprimer un livre

### Multimédia
- `GET /api/multimedia` - Tous les contenus
- `GET /api/multimedia/:id` - Un contenu
- `GET /api/multimedia/type/:type` - Par type (video/audio/podcast)
- `POST /api/multimedia` - Créer un contenu
- `PUT /api/multimedia/:id` - Modifier un contenu
- `DELETE /api/multimedia/:id` - Supprimer un contenu

### Témoignages
- `GET /api/temoignages` - Témoignages approuvés
- `GET /api/temoignages/all` - Tous les témoignages
- `POST /api/temoignages` - Soumettre un témoignage
- `PUT /api/temoignages/:id/approuver` - Approuver
- `DELETE /api/temoignages/:id` - Supprimer

### Newsletter
- `POST /api/newsletter/subscribe` - S'inscrire
- `POST /api/newsletter/unsubscribe` - Se désinscrire
- `GET /api/newsletter` - Tous les abonnés

### Contact
- `POST /api/contact` - Envoyer un message
- `GET /api/contact` - Tous les messages
- `GET /api/contact/non-lus` - Messages non lus
- `PUT /api/contact/:id/marquer-lu` - Marquer comme lu
- `DELETE /api/contact/:id` - Supprimer un message

## 📸 Ajout des Images

Placez vos images dans le dossier `frontend/public/assets/` :

- `logo-luchnos_variant_1.png` - Logo principal
- `hero-banner-lamp.jpg` - Bannière hero
- `event-community.jpg` - Image événements
- `book-cover-3d.jpg` - Couverture livre 3D
- Autres images selon vos besoins

## 🔧 Scripts Disponibles

### Backend
```powershell
npm start          # Démarrer en production
npm run dev        # Démarrer en développement (nodemon)
```

### Frontend
```powershell
npm run dev        # Démarrer le serveur de développement
npm run build      # Compiler pour production
npm run preview    # Prévisualiser la build
```

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que PostgreSQL est démarré (port 5432)
- Vérifiez les identifiants dans `.env`
- Vérifiez que le port 5000 est libre

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend est démarré
- Vérifiez `VITE_API_URL` dans `.env`
- Vérifiez la console du navigateur pour les erreurs

### Erreurs de base de données
- Vérifiez que la base `luchnos_db` existe
- Réexécutez le script PostgreSQL
- Vérifiez les permissions PostgreSQL

## 📝 Données de Test

Le script SQL inclut des données de test :
- 2 événements (Conférence Prophétique, Séminaire)
- 1 livre (Les Mystères du Royaume)
- 3 témoignages

## 🔐 Sécurité

⚠️ **Important pour la production** :
- Changez les mots de passe PostgreSQL
- Utilisez des variables d'environnement sécurisées
- Ajoutez une authentification pour les routes admin
- Configurez CORS correctement
- Utilisez HTTPS

## 📄 Licence

Ce projet est créé pour le ministère Lampe Allumée (Luchnos).

---

## 🙏 Support

Pour toute question ou support :
- Email : contact@luchnos.org
- Site web : [À configurer]

---

**Maranatha - Notre Seigneur vient! 🕯️**
