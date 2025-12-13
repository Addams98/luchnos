# 🚀 GUIDE DÉPLOIEMENT RENDER - PAS À PAS

## ✅ ÉTAPE 1: PRÉPARER LE CODE (2 min)

```powershell
# Dans PowerShell, depuis C:\Luchnos
git add .
git commit -m "Prêt pour Render"
```

---

## ✅ ÉTAPE 2: GITHUB (3 min)

1. Ouvrez: **https://github.com/new**
2. Nom du repository: **luchnos**
3. Cliquez: **Create repository**
4. Exécutez (remplacez VOTRE_USERNAME):

```powershell
git remote add origin https://github.com/VOTRE_USERNAME/luchnos.git
git branch -M main
git push -u origin main
```

---

## ✅ ÉTAPE 3: BASE DE DONNÉES (2 min)

1. Allez sur: **https://dashboard.render.com**
2. Cliquez: **New +** → **PostgreSQL**
3. Configuration:
   - Name: `luchnos-db`
   - Region: `Frankfurt`
   - Plan: **Free**
4. Cliquez: **Create Database**
5. **📋 NOTEZ l'Internal Database URL** (commence par `postgresql://`)

---

## ✅ ÉTAPE 4: BACKEND API (4 min)

1. Dashboard Render → **New +** → **Web Service**
2. **Connect** votre repository GitHub `luchnos`
3. Configuration:
   - Name: `luchnos-backend`
   - Region: `Frankfurt`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

4. **Environment Variables** (cliquez Advanced):
   
   ```
   NODE_ENV=production
   DATABASE_URL=[Collez l'Internal Database URL de l'étape 3]
   JWT_SECRET=[Voir ci-dessous comment générer]
   ```

5. Cliquez: **Create Web Service**

### Générer JWT_SECRET:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat et collez-le comme valeur de JWT_SECRET.

**📋 NOTEZ l'URL du backend** (ex: `https://luchnos-backend.onrender.com`)

---

## ✅ ÉTAPE 5: FRONTEND (4 min)

1. Dashboard Render → **New +** → **Static Site**
2. **Connect** votre repository GitHub `luchnos`
3. Configuration:
   - Name: `luchnos-frontend`
   - Region: `Frankfurt`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: **Free**

4. **Environment Variables**:
   
   ```
   VITE_API_URL=https://luchnos-backend.onrender.com/api
   ```
   
   ⚠️ Remplacez par votre vraie URL backend de l'étape 4!

5. Cliquez: **Create Static Site**

---

## ✅ ÉTAPE 6: INITIALISER LA BASE (2 min)

### Méthode 1: Via Shell Render

1. Retournez à votre base de données PostgreSQL dans Render
2. Cliquez sur l'onglet **"Shell"**
3. Copiez le contenu du fichier `C:\Luchnos\init-render-db.sql`
4. Collez dans le shell et appuyez sur Entrée

### Méthode 2: Via psql local (si installé)

```powershell
# Remplacez par votre External Database URL
psql "postgresql://..." < init-render-db.sql
```

---

## 🎉 TERMINÉ! TESTER VOTRE SITE

Votre site est maintenant en ligne:

- **Frontend**: `https://luchnos-frontend.onrender.com`
- **Backend**: `https://luchnos-backend.onrender.com`
- **Admin**: `https://luchnos-frontend.onrender.com/admin/login`

### Login Admin:
- Email: `admin@luchnos.com`
- Password: `Admin@123`

⚠️ **CHANGEZ LE MOT DE PASSE IMMÉDIATEMENT!**

---

## 🐛 PROBLÈMES COURANTS

### Backend 502 Bad Gateway
→ Attendez 60 secondes (backend se réveille du sommeil)

### CORS Error
→ Vérifiez que VITE_API_URL correspond bien à votre URL backend

### Build Failed
→ Consultez les logs dans Render Dashboard

### Base de données ne se connecte pas
→ Vérifiez que DATABASE_URL est correctement copiée

---

## ⏱️ TEMPS TOTAL: 20 MINUTES

✅ Coût: **0€**
✅ Durée: **5-90 jours gratuits**
✅ SSL: **Automatique**

---

**Besoin d'aide? Suivez les étapes dans l'ordre et vérifiez chaque configuration!**
