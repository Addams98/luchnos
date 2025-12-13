# 🎯 Déploiement Render - Méthode Simple (5 jours)

## Configuration Rapide

### Option 1: Via le Dashboard (Recommandé)

#### A. Base de Données PostgreSQL

1. **Créer la base de données**
   - Dashboard Render → New + → PostgreSQL
   - Name: `luchnos-db`
   - Region: Frankfurt
   - Plan: **Free** ✅
   - Create Database
   
2. **Noter les credentials**
   - Internal Database URL (pour le backend)
   - External Database URL (pour vous)

3. **Importer le schéma**
   ```bash
   # Copiez le contenu de backend/config/postgresql-schema.sql
   # Collez dans Render DB Shell ou utilisez:
   psql "votre_external_database_url" < backend/config/postgresql-schema.sql
   ```

4. **Créer l'admin**
   ```sql
   INSERT INTO utilisateurs (nom, email, password, role) 
   VALUES ('Admin', 'admin@luchnos.com', 
   '$2b$10$CwTycUXWue0Thq9StjUM0uJ8qjhg8qWVJVPF.qJP8lhPBh2hXYJBe', 'admin');
   ```

#### B. Backend API

1. **Créer le service**
   - Dashboard → New + → Web Service
   - Connect Repository: Votre GitHub luchnos
   - Name: `luchnos-backend`
   - Region: Frankfurt
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free** ✅

2. **Variables d'environnement**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[Coller Internal Database URL]
   JWT_SECRET=[Générer: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   ```

3. **Attendre le déploiement** (3-5 min)

4. **Noter l'URL**: `https://luchnos-backend.onrender.com`

#### C. Frontend

1. **Créer le site statique**
   - Dashboard → New + → Static Site
   - Connect Repository: Votre GitHub luchnos
   - Name: `luchnos-frontend`
   - Region: Frankfurt
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Plan: **Free** ✅

2. **Variables d'environnement**
   ```
   VITE_API_URL=https://luchnos-backend.onrender.com/api
   ```

3. **Attendre le déploiement** (3-5 min)

4. **C'est prêt!** → `https://luchnos-frontend.onrender.com`

---

## ⏱️ Durée de Vie

### Plan Gratuit Render

| Service | Durée | Notes |
|---------|-------|-------|
| PostgreSQL | 90 jours | 1 GB gratuit |
| Backend | Illimité* | *750h/mois (31 jours) |
| Frontend | Illimité | Toujours actif |

✅ **Pour 5 jours: 100% gratuit, aucune limitation!**

### Sommeil du Backend

- Le backend se met en veille après **15 minutes** d'inactivité
- Redémarre en **30-60 secondes** au premier accès
- Solution: Ajoutez un ping automatique (optionnel)

---

## 🔗 URLs Finales

Après déploiement, vous aurez:

- **Site public**: `https://luchnos-frontend.onrender.com`
- **API Backend**: `https://luchnos-backend.onrender.com`
- **Admin**: `https://luchnos-frontend.onrender.com/admin/login`
- **Base de données**: Accessible via l'External URL

---

## ✅ Checklist 5 Jours

- [ ] Jour 1: Déploiement initial (suivre étapes A, B, C)
- [ ] Jour 2: Test et ajustements
- [ ] Jour 3-4: Utilisation normale
- [ ] Jour 5: Backup des données si nécessaire
- [ ] Après J+5: Supprimer les services ou continuer gratuitement

---

## 🆘 Support Rapide

### Backend ne démarre pas
```bash
# Vérifier les logs dans Render Dashboard
# Sections: Logs → Events
```

### CORS Error
```javascript
// Vérifier backend/server.js ligne 11-15
origin: ['https://luchnos-frontend.onrender.com']
```

### 502 Bad Gateway
```
Attendre 60 secondes → Backend se réveille
Refresh la page
```

---

## 💾 Backup Avant Suppression

Si vous voulez garder les données après 5 jours:

```bash
# Exporter la base
pg_dump "votre_external_database_url" > backup_luchnos.sql

# Réimporter plus tard
psql "nouvelle_database_url" < backup_luchnos.sql
```

---

**Temps estimé de déploiement: 15-20 minutes** ⚡
