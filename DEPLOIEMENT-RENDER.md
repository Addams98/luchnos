# 🚀 Guide de Déploiement sur Render

Ce guide vous permettra de déployer Luchnos sur Render pour une durée de 5 jours (ou plus avec le plan gratuit).

## 📋 Prérequis

1. Compte GitHub (pour héberger le code)
2. Compte Render (https://render.com) - Inscription gratuite
3. Code source du projet Luchnos

## 🔧 Étape 1: Préparation du Code

### 1.1 Initialiser Git (si pas déjà fait)

```powershell
cd C:\Luchnos
git init
git add .
git commit -m "Initial commit - Luchnos deployment"
```

### 1.2 Créer un dépôt GitHub

1. Allez sur https://github.com
2. Créez un nouveau repository "luchnos"
3. Suivez les instructions pour pousser votre code:

```powershell
git remote add origin https://github.com/VOTRE_USERNAME/luchnos.git
git branch -M main
git push -u origin main
```

## 🗄️ Étape 2: Créer la Base de Données PostgreSQL sur Render

1. Connectez-vous à https://dashboard.render.com
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez:
   - **Name**: `luchnos-db`
   - **Database**: `luchnos_db`
   - **User**: `luchnos_admin`
   - **Region**: Frankfurt (ou le plus proche)
   - **Plan**: Free
4. Cliquez sur **"Create Database"**
5. **IMPORTANT**: Notez les informations suivantes:
   - `Internal Database URL` (pour le backend)
   - `External Database URL` (pour les connexions externes)

### 2.1 Initialiser le Schéma

Une fois la base créée, vous devez importer le schéma:

1. Dans le dashboard de la base de données, allez dans **"Shell"**
2. Copiez le contenu de `backend/config/postgresql-schema.sql`
3. Exécutez-le dans le shell

OU utilisez la connexion externe:

```powershell
# Remplacez par votre External Database URL
psql "postgresql://user:password@host/database" < backend/config/postgresql-schema.sql
```

## 🖥️ Étape 3: Déployer le Backend

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repository GitHub
3. Configurez:
   - **Name**: `luchnos-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Variables d'environnement** (cliquez sur "Advanced"):
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[Coller l'Internal Database URL de l'étape 2]
   JWT_SECRET=[Générer une clé aléatoire sécurisée]
   YOUTUBE_API_KEY=[Votre clé YouTube API si vous en avez]
   ```

5. Cliquez sur **"Create Web Service"**
6. Attendez la fin du déploiement (3-5 minutes)
7. Notez l'URL du backend: `https://luchnos-backend.onrender.com`

## 🌐 Étape 4: Déployer le Frontend

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Static Site"**
2. Connectez votre repository GitHub
3. Configurez:
   - **Name**: `luchnos-frontend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

4. **Variables d'environnement**:
   ```
   VITE_API_URL=https://luchnos-backend.onrender.com/api
   ```

5. Cliquez sur **"Create Static Site"**
6. Attendez la fin du déploiement (3-5 minutes)
7. Votre site sera disponible à: `https://luchnos-frontend.onrender.com`

## ✅ Étape 5: Vérification

### 5.1 Test du Backend

```powershell
# Test de l'API
curl https://luchnos-backend.onrender.com/api/livres
```

### 5.2 Test du Frontend

1. Ouvrez `https://luchnos-frontend.onrender.com`
2. Vérifiez que la page d'accueil s'affiche
3. Testez la navigation entre les pages
4. Vérifiez que les données se chargent depuis l'API

## 🔐 Étape 6: Configuration de l'Admin

1. Connectez-vous à la base de données via Shell ou psql
2. Créez un utilisateur admin:

```sql
INSERT INTO utilisateurs (nom, email, password, role) 
VALUES (
  'Admin Luchnos', 
  'admin@luchnos.com', 
  '$2b$10$CwTycUXWue0Thq9StjUM0uJ8qjhg8qWVJVPF.qJP8lhPBh2hXYJBe', -- Admin@123
  'admin'
);
```

3. Accédez à: `https://luchnos-frontend.onrender.com/admin/login`
4. Connectez-vous avec: `admin@luchnos.com` / `Admin@123`
5. **Changez immédiatement le mot de passe!**

## ⚙️ Configuration Post-Déploiement

### Mettre à jour le CORS

Si vous avez un nom de domaine personnalisé, mettez à jour dans `backend/server.js`:

```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://votre-domaine.com']
  : ['http://localhost:3000']
```

### Uploads de Fichiers

⚠️ **Important**: Le système de fichiers de Render est éphémère. Pour la production:

1. Utilisez un service de stockage cloud (AWS S3, Cloudinary, etc.)
2. Ou configurez un volume persistant (plan payant)

## 📊 Plan Gratuit - Limitations

- **Base de données**: 1 GB de stockage, expire après 90 jours
- **Backend**: Se met en veille après 15 min d'inactivité, redémarre au prochain accès (délai de 30-60s)
- **Frontend**: Toujours actif, pas de limitation

## 🔄 Redéploiement Automatique

Render redéploie automatiquement à chaque push sur la branche `main`:

```powershell
git add .
git commit -m "Mise à jour"
git push origin main
```

## 🐛 Dépannage

### Le backend ne démarre pas
1. Vérifiez les logs dans le dashboard Render
2. Vérifiez que `DATABASE_URL` est correctement configurée
3. Vérifiez que le schéma PostgreSQL a été importé

### Le frontend ne se connecte pas au backend
1. Vérifiez que `VITE_API_URL` pointe vers le bon backend
2. Vérifiez les CORS dans `server.js`
3. Ouvrez la console du navigateur pour voir les erreurs

### Erreur 502 Bad Gateway
- Le backend est en train de se réveiller (attendre 30-60s)
- Ou le backend a crashé (vérifier les logs)

## 📝 URLs Importantes

- **Frontend**: https://luchnos-frontend.onrender.com
- **Backend**: https://luchnos-backend.onrender.com
- **Admin**: https://luchnos-frontend.onrender.com/admin/login
- **Dashboard Render**: https://dashboard.render.com

## 💰 Coûts

Le plan gratuit permet:
- ✅ Hébergement backend + frontend + base de données
- ✅ SSL automatique (HTTPS)
- ✅ Déploiement continu depuis GitHub
- ✅ 750 heures/mois par service (suffisant pour 5 jours 24/7)

**Coût total: 0€ pour 5 jours** (ou jusqu'à 90 jours sur plan gratuit)

## 🎯 Checklist Déploiement

- [ ] Repository GitHub créé et code poussé
- [ ] Base de données PostgreSQL créée sur Render
- [ ] Schéma PostgreSQL importé dans la base
- [ ] Backend déployé avec DATABASE_URL configurée
- [ ] Frontend déployé avec VITE_API_URL configurée
- [ ] Utilisateur admin créé dans la base
- [ ] Test de connexion admin réussi
- [ ] Test des fonctionnalités principales

---

**Bonne chance avec votre déploiement! 🕯️**
