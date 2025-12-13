# Variables d'Environnement pour Render

## Backend (luchnos-backend)

```bash
# Environment
NODE_ENV=production

# Server Port (Render gère automatiquement)
PORT=5000

# Database - Render PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/database
# ⚠️ À remplacer par l'Internal Database URL de votre PostgreSQL Render

# JWT Secret - Générer une clé sécurisée
JWT_SECRET=GENERER_UNE_CLE_SECURISEE_ICI
# Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# YouTube API (Optionnel)
YOUTUBE_API_KEY=YOUR_API_KEY_HERE
YOUTUBE_CHANNEL_ID=YOUR_CHANNEL_ID_HERE

# Email (Optionnel pour notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
```

## Frontend (luchnos-frontend)

```bash
# API URL - URL du backend Render
VITE_API_URL=https://luchnos-backend.onrender.com/api
# ⚠️ À remplacer par votre URL backend Render réelle
```

---

## 🔐 Génération JWT_SECRET

### Méthode 1: Node.js
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Méthode 2: PowerShell
```powershell
$bytes = New-Object Byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.BitConverter]::ToString($bytes).Replace('-','').ToLower()
```

### Méthode 3: En ligne
https://generate-secret.vercel.app/32

---

## 📝 Comment Ajouter dans Render

### Via le Dashboard

1. Allez dans votre service (backend ou frontend)
2. Onglet **"Environment"**
3. Cliquez sur **"Add Environment Variable"**
4. Ajoutez chaque variable:
   - Key: `NODE_ENV`
   - Value: `production`
5. Cliquez **"Save Changes"**
6. Le service redéploiera automatiquement

### Via Blueprint (render.yaml)

Les variables sont déjà définies dans `render.yaml`.
Vous devrez juste remplir les valeurs manquantes dans le dashboard.

---

## ⚠️ Sécurité

### ✅ À FAIRE:
- Générer un JWT_SECRET unique et long (minimum 32 caractères)
- Ne JAMAIS commiter le `.env` dans Git
- Changer le mot de passe admin après le premier login
- Utiliser des mots de passe forts pour PostgreSQL

### ❌ NE PAS FAIRE:
- Utiliser des secrets par défaut en production
- Partager vos variables d'environnement publiquement
- Commiter des fichiers `.env` sur GitHub
- Utiliser le même JWT_SECRET partout

---

## 🔄 Mise à Jour des Variables

Si vous changez une variable:
1. Modifier dans Render Dashboard → Environment
2. Save Changes
3. Le service redéploie automatiquement (~2-3 min)

---

## 📋 Checklist Variables

### Backend
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (fourni par Render PostgreSQL)
- [ ] `JWT_SECRET` (généré de manière sécurisée)
- [ ] `YOUTUBE_API_KEY` (si synchronisation YouTube)

### Frontend
- [ ] `VITE_API_URL` (URL du backend Render)

---

## 🧪 Test des Variables

### Tester en local d'abord:

```powershell
# Backend
cd backend
cp .env.example .env
# Éditez .env avec vos valeurs
npm start

# Frontend
cd frontend
cp .env.example .env
# Éditez .env avec VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Tester en production:

```bash
# Vérifier que le backend lit les variables
curl https://luchnos-backend.onrender.com/

# Vérifier que le frontend se connecte au backend
# Ouvrir la console du navigateur sur votre site
# Pas d'erreur CORS = ✅
```

---

**Toutes les variables sont prêtes! 🔐**
