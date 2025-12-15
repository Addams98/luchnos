# 🔍 Vérification Déploiement Render

## 🚨 Problème Actuel : CORS bloqué

Les requêtes frontend → backend sont bloquées par CORS malgré la configuration.

---

## ✅ Checklist de Vérification

### 1️⃣ Backend démarré ?

**Allez sur** : https://dashboard.render.com

1. Cliquez sur le service **"luchnos"** (backend)
2. Vérifiez le **Status** : Doit être `Live` (vert)
3. Si `Building` ou `Failed` → Attendez ou consultez les logs

---

### 2️⃣ Variables d'environnement définies ?

**Dashboard Render → Service "luchnos" → Environment**

Vérifiez que ces variables sont **TOUTES DÉFINIES** :

| Variable | Status | Action si manquante |
|----------|--------|---------------------|
| `JWT_SECRET` | ⚠️ **CRITIQUE** | Ajoutez : `010a12b0f85304b54723361a91d515476fe7072723642688c86e1a9b7299950b2d4688039efd0f94eed844f777517384e18a44adc590172f9425f8f96018eda4` |
| `NODE_ENV` | Recommandé | Ajoutez : `production` |
| `DATABASE_URL` | ✅ Auto | Render gère automatiquement |
| `DB_HOST` | ✅ Auto | Render gère automatiquement |
| `DB_USER` | ✅ Auto | Render gère automatiquement |
| `DB_PASSWORD` | ✅ Auto | Render gère automatiquement |
| `DB_NAME` | ✅ Auto | Render gère automatiquement |
| `DB_PORT` | ✅ Auto | Render gère automatiquement |

**Si JWT_SECRET manque** :
1. Cliquez **"Add Environment Variable"**
2. Key : `JWT_SECRET`
3. Value : Collez le secret ci-dessus
4. **Save Changes** → Attendre redéploiement (2-3min)

---

### 3️⃣ Tester l'endpoint de santé

**Ouvrez dans votre navigateur** :
```
https://luchnos.onrender.com/api/health
```

**Résultat attendu** :
```json
{
  "success": true,
  "message": "API fonctionnelle",
  "timestamp": "2025-12-15T...",
  "cors": {
    "origin": "...",
    "allowedOrigins": [
      "https://luchnos-frontend-web.onrender.com",
      "..."
    ]
  },
  "env": {
    "nodeEnv": "production",
    "hasJwtSecret": true,
    "port": 10000
  }
}
```

**Si erreur 502/503** : Backend n'a pas démarré
**Si timeout** : Backend crash au démarrage
**Si `hasJwtSecret: false`** : JWT_SECRET manquant !

---

### 4️⃣ Consulter les logs backend

**Dashboard Render → Service "luchnos" → Logs**

**Recherchez** :
```
✅ 🔍 Vérification configuration...
✅ 📍 NODE_ENV: production
✅ 📍 PORT: 10000
✅ 📍 JWT_SECRET: ✅ Défini
✅ 🚀 Serveur démarré sur le port 10000
✅ ✅ Connecté à PostgreSQL
```

**Si vous voyez** :
```
❌ 📍 JWT_SECRET: ⚠️ Non défini
```
→ Ajoutez JWT_SECRET dans Environment (voir étape 2)

**Si crash ou erreur** :
- `ECONNREFUSED` → PostgreSQL non accessible
- `JWT_SECRET non défini` → Variable environnement manquante
- `Module not found` → Dépendances npm manquantes (vérifier package.json)

---

### 5️⃣ Tester CORS avec curl

**PowerShell** :
```powershell
curl -H "Origin: https://luchnos-frontend-web.onrender.com" -I https://luchnos.onrender.com/api/health
```

**Résultat attendu** :
```
HTTP/2 200
access-control-allow-origin: https://luchnos-frontend-web.onrender.com
access-control-allow-credentials: true
```

**Si `access-control-allow-origin` manque** :
- Backend n'a pas appliqué config CORS
- Vérifier logs pour erreurs au démarrage

---

### 6️⃣ Frontend : Variables d'environnement

**Dashboard Render → Service "luchnos-frontend-web" → Environment**

Vérifiez :
```
VITE_API_URL = https://luchnos.onrender.com/api
```

**Si différent** : Corrigez et sauvegardez (redéploiement auto)

---

## 🔧 Solutions aux Problèmes Courants

### Problème 1 : "No Access-Control-Allow-Origin header"
**Cause** : Backend crash ou CORS mal configuré
**Solution** :
1. Vérifier logs backend (étape 4)
2. Confirmer JWT_SECRET défini (étape 2)
3. Tester /api/health (étape 3)

### Problème 2 : Backend status "Failed"
**Cause** : Erreur au démarrage (JWT_SECRET, DB, syntaxe)
**Solution** :
1. Consulter logs complets dans Render
2. Chercher ligne rouge avec `Error:` ou `❌`
3. Corriger selon message d'erreur

### Problème 3 : Timeout 504
**Cause** : Backend démarre trop lentement ou crash
**Solution** :
1. Vérifier plan Render (Free tier = sleep après 15min inactivité)
2. Attendre 30-60s première requête (cold start)
3. Activer "Keep Alive" si disponible

### Problème 4 : 401 Unauthorized
**Cause** : JWT invalide ou expiré
**Solution** :
1. Effacer localStorage frontend : `localStorage.clear()`
2. Reconnecter depuis /admin/login
3. Vérifier JWT_SECRET identique entre déploiements

---

## 📞 Commandes de Debug

### Test API locale :
```powershell
cd c:\Luchnos\backend
$env:JWT_SECRET="test123"
npm start
```

### Test connexion DB Render :
```powershell
$env:DATABASE_URL="postgresql://..."
node backend/scripts/migrate-refresh-tokens-render.js
```

### Vérifier migrations :
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## ✅ État Actuel

- [x] Migration PostgreSQL locale ✅
- [x] Migration PostgreSQL Render ✅
- [x] Configuration CORS dynamique ✅
- [x] Health check endpoint ✅
- [x] Logs diagnostiques ✅
- [ ] **JWT_SECRET sur Render** ⚠️ **À FAIRE**
- [ ] Vérifier logs Render ⏳
- [ ] Tester /api/health ⏳

---

## 🎯 Prochaine Action

1. **Allez sur Render Dashboard**
2. **Ajoutez JWT_SECRET** (voir étape 2)
3. **Attendez 2-3 minutes** (redéploiement)
4. **Testez** : https://luchnos.onrender.com/api/health
5. **Rechargez frontend** : https://luchnos-frontend-web.onrender.com

Si CORS persiste après ajout JWT_SECRET, partagez les logs Render pour diagnostic approfondi.
