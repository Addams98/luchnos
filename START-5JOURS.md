# ⚡ DÉMARRAGE RAPIDE - 5 JOURS SUR RENDER

## 🎯 Objectif
Déployer Luchnos gratuitement sur Render pour 5 jours en **3 étapes simples**.

---

## ✅ Étape 1: Préparer le Code (5 min)

```powershell
# Dans le dossier C:\Luchnos
.\prepare-render.ps1
```

Ou manuellement:
```powershell
git init
git add .
git commit -m "Ready for Render deployment"
```

---

## ✅ Étape 2: GitHub (3 min)

1. Créer un nouveau repository: https://github.com/new
   - Nom: `luchnos`
   - Public ou Private
   - Ne pas initialiser avec README

2. Pousser le code:
```powershell
git remote add origin https://github.com/VOTRE_USERNAME/luchnos.git
git branch -M main
git push -u origin main
```

---

## ✅ Étape 3: Déployer sur Render (10 min)

### A. PostgreSQL (2 min)

1. https://dashboard.render.com → **New +** → **PostgreSQL**
2. Configuration:
   - Name: `luchnos-db`
   - Region: **Frankfurt**
   - Plan: **Free**
3. **Create Database**
4. **Noter** l'Internal Database URL

### B. Backend (4 min)

1. **New +** → **Web Service**
2. Connect votre repo GitHub
3. Configuration:
   - Name: `luchnos-backend`
   - Region: **Frankfurt**
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
4. **Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=[Coller Internal Database URL]
   JWT_SECRET=[Générer avec: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   ```
5. **Create Web Service**
6. **Noter** l'URL: `https://luchnos-backend.onrender.com`

### C. Frontend (4 min)

1. **New +** → **Static Site**
2. Connect votre repo GitHub
3. Configuration:
   - Name: `luchnos-frontend`
   - Region: **Frankfurt**
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Plan: **Free**
4. **Environment Variables**:
   ```
   VITE_API_URL=https://luchnos-backend.onrender.com/api
   ```
5. **Create Static Site**

---

## ✅ Étape 4: Initialiser la Base (2 min)

### Via Shell Render:

1. Allez dans votre PostgreSQL service
2. Cliquez sur **"Shell"** (en haut)
3. Copiez-collez le contenu de `init-render-db.sql`
4. Appuyez sur Entrée

### Via Ligne de Commande:

```powershell
# Remplacez par votre External Database URL
psql "postgresql://user:pass@host/db" < init-render-db.sql
```

---

## 🎉 C'EST PRÊT!

Votre site est maintenant en ligne:
- **Frontend**: https://luchnos-frontend.onrender.com
- **Backend**: https://luchnos-backend.onrender.com
- **Admin**: https://luchnos-frontend.onrender.com/admin/login

**Login admin**:
- Email: `admin@luchnos.com`
- Password: `Admin@123`

⚠️ **Changez le mot de passe immédiatement!**

---

## 🛠️ Maintenance (Optionnel)

### Éviter le Sommeil du Backend

Le backend se met en veille après 15 min. Pour l'éviter:

1. Hébergez `keep-alive.html` sur Netlify/Vercel
2. Ou utilisez un service comme UptimeRobot (gratuit)
3. Ou acceptez 30-60s de délai au réveil

---

## 💾 Backup (Jour 5)

Si vous voulez garder vos données:

```powershell
# Exporter
pg_dump "votre_external_db_url" > backup_luchnos_$(date +%Y%m%d).sql

# Réimporter plus tard
psql "nouvelle_db_url" < backup_luchnos_20251213.sql
```

---

## 🆘 Aide Rapide

| Problème | Solution |
|----------|----------|
| Backend 502 | Attendre 60s (réveil du sommeil) |
| CORS Error | Vérifier VITE_API_URL et CORS dans server.js |
| Build Failed | Tester `npm run build` localement d'abord |
| DB Connection | Vérifier DATABASE_URL dans variables env |

---

## 📊 Résumé

✅ **Déploiement**: 20 minutes
✅ **Coût**: 0€
✅ **Durée**: 5 jours (ou 90 jours gratuits)
✅ **Services**: 3 (DB + Backend + Frontend)
✅ **SSL**: Inclus automatiquement
✅ **Déploiement continu**: Automatique depuis GitHub

---

**Besoin d'aide détaillée?**
→ Voir `DEPLOIEMENT-SIMPLE-5JOURS.md`

**Prêt à déployer! 🚀**
