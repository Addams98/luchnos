# 🔒 Guide de Déploiement Sécurisé - Render

## 📋 Prérequis

- ✅ Compte Render actif
- ✅ Backend déployé : `luchnos.onrender.com`
- ✅ Frontend déployé : `luchnos-frontend-web.onrender.com`
- ✅ PostgreSQL : `luchnos_db` (Render managed)
- ✅ Accès GitHub : Repository connecté

---

## 🚀 Étapes de Déploiement (Mises à jour de sécurité)

### 1️⃣ Migration Base de Données (CRITIQUE)

#### A. Créer la table refresh_tokens

1. Connectez-vous au **Dashboard Render** : https://dashboard.render.com
2. Cliquez sur votre base de données **"luchnos_db"**
3. Onglet **"Connect"** → Copiez l'URL de connexion externe
4. Utilisez un client PostgreSQL (TablePlus, pgAdmin, ou console web)
5. Exécutez le contenu du fichier :

```
backend/migrations/create_refresh_tokens.sql
```

**Vérification** :
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'refresh_tokens';

-- Résultat attendu : refresh_tokens
```

---

### 2️⃣ Variables d'Environnement (CRITIQUE)

#### Backend (service "luchnos")

1. Dashboard Render → Service **"luchnos"** (backend)
2. Onglet **"Environment"**
3. Ajoutez/Modifiez ces variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `JWT_SECRET` | `010a12b0f85304b54723361a91d515476fe7072723642688c86e1a9b7299950b2d4688039efd0f94eed844f777517384e18a44adc590172f9425f8f96018eda4` | ⚠️ **REMPLACEZ** par votre propre secret généré |
| `NODE_ENV` | `production` | Mode production |
| `DATABASE_URL` | _(déjà configuré)_ | URL PostgreSQL Render |
| `DB_HOST` | _(déjà configuré)_ | Host PostgreSQL |
| `DB_USER` | _(déjà configuré)_ | Username PostgreSQL |
| `DB_PASSWORD` | _(déjà configuré)_ | Password PostgreSQL |
| `DB_NAME` | `luchnos_db` | Nom de la base |
| `DB_PORT` | `5432` | Port PostgreSQL |
| `YOUTUBE_API_KEY` | `AIzaSyDzbvn-7Z7LQ104uRlUnV8vWzAuEb15dAE` | API YouTube |

#### Frontend (service "luchnos-frontend-web")

1. Dashboard Render → Service **"luchnos-frontend-web"**
2. Onglet **"Environment"**
3. Vérifiez ces variables :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `https://luchnos.onrender.com/api` | URL API backend |

4. Cliquez sur **"Save Changes"** (redéploiement automatique)

---

### 3️⃣ Générer un JWT_SECRET Unique (OBLIGATOIRE)

⚠️ **NE PAS UTILISER** le secret dans ce document (exemple seulement) !

#### Méthode A : Via Node.js (Recommandé)
```bash
node backend/scripts/generate-jwt-secret.js
```

#### Méthode B : En ligne de commande
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Copiez le secret généré et ajoutez-le dans les variables d'environnement Render.**

---

### 4️⃣ Commit et Push des Changements

```bash
# Vérifier les fichiers modifiés
git status

# Ajouter tous les changements de sécurité
git add .

# Commit avec message descriptif
git commit -m "🔒 Security: JWT refresh tokens, Helmet, rate limiting, validation"

# Push vers GitHub
git push origin main
```

**Render détectera automatiquement le push et redéploiera le backend.**

---

### 5️⃣ Vérification Post-Déploiement

#### A. Vérifier les logs backend

1. Dashboard Render → Service **"luchnos"**
2. Onglet **"Logs"**
3. Vérifiez qu'il n'y a **PAS** ce message :
   ```
   ❌ ERREUR CRITIQUE : JWT_SECRET non défini en production !
   ```

4. Recherchez ces messages de succès :
   ```
   ✅ Connecté à PostgreSQL
   ✅ Server running on port 5000
   🔗 API URL: ...
   ```

#### B. Tester l'authentification

1. Ouvrez : https://luchnos-frontend-web.onrender.com/admin/login
2. Connectez-vous avec :
   - Email : `admin@luchnos.com`
   - Mot de passe : `Luchnos@2025`

3. Ouvrez la **Console du navigateur** (F12)
4. Vérifiez dans **Application → Local Storage** :
   - ✅ `luchnos_access_token` (nouveau format)
   - ✅ `luchnos_refresh_token` (nouveau format)
   - ✅ `luchnos_user` (JSON avec rôle)

#### C. Tester le refresh automatique

1. Dans la console du navigateur :
```javascript
// Voir l'expiration du token
const token = localStorage.getItem('luchnos_access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expiration:', new Date(payload.exp * 1000));
```

2. Attendez 15 minutes (ou modifiez temporairement `expiresIn` dans le code)
3. Faites une action admin (ex: ouvrir Messages)
4. Le token devrait se renouveler automatiquement (vérifier dans Network tab)

#### D. Tester le rate limiting

1. Déconnectez-vous
2. Tentez de vous connecter 5 fois avec un mauvais mot de passe
3. À la 6ème tentative, vous devriez voir :
   ```
   Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.
   ```

#### E. Vérifier les headers de sécurité

1. Ouvrez : https://luchnos.onrender.com/api/livres
2. Dans **Network tab → Headers** :
   - ✅ `X-Content-Type-Options: nosniff`
   - ✅ `X-Frame-Options: SAMEORIGIN`
   - ✅ `Strict-Transport-Security: max-age=...`
   - ✅ `Content-Security-Policy: default-src 'self'...`
   - ❌ `X-Powered-By` (supprimé)

---

### 6️⃣ Nettoyage de l'Ancien Format de Tokens

**Migration automatique** : Les utilisateurs qui se reconnectent verront leurs tokens mis à jour.

**Action manuelle** (optionnel) : Pour forcer la migration immédiate, effacer le localStorage via la page :

1. Créer une page temporaire : `frontend/public/force-logout.html`
```html
<!DOCTYPE html>
<html>
<head><title>Migration Tokens</title></head>
<body>
  <script>
    localStorage.removeItem('luchnos_token'); // Ancien format
    alert('Tokens migrés. Reconnectez-vous.');
    window.location.href = '/admin/login';
  </script>
</body>
</html>
```

2. Envoyer le lien aux admins : `https://luchnos-frontend-web.onrender.com/force-logout.html`

---

## 🔍 Checklist de Vérification Finale

### Sécurité
- [ ] Migration `refresh_tokens` table appliquée
- [ ] JWT_SECRET unique défini sur Render
- [ ] Pas de `JWT_SECRET` dans le code source
- [ ] `.env` dans `.gitignore`
- [ ] Helmet.js activé (headers sécurisés)
- [ ] Rate limiting actif (5 tentatives login)
- [ ] Validation des entrées (express-validator)
- [ ] CORS limité aux domaines autorisés

### Fonctionnalités
- [ ] Login fonctionne
- [ ] Access token expire après 15 minutes
- [ ] Refresh token renouvelle automatiquement
- [ ] Déconnexion révoque les tokens
- [ ] Upload de fichiers fonctionne
- [ ] Sync YouTube fonctionne
- [ ] Formulaires de contact/témoignage fonctionnent

### Performance
- [ ] Backend répond < 500ms
- [ ] Frontend charge < 3s
- [ ] Images optimisées
- [ ] Pas de logs excessifs en production

---

## 🆘 Dépannage

### Erreur : "JWT_SECRET non défini"
**Solution** :
1. Vérifiez les variables d'environnement sur Render
2. Cliquez "Save Changes" pour forcer le redéploiement
3. Attendez 2-3 minutes le redémarrage du service

### Erreur : "Token expiré" en boucle
**Causes possibles** :
- Refresh token révoqué ou expiré
- Table `refresh_tokens` non créée
- Ancien format de token dans localStorage

**Solution** :
1. Effacer localStorage : `localStorage.clear()`
2. Reconnecter l'utilisateur
3. Vérifier que la table `refresh_tokens` existe

### Erreur : "Trop de requêtes"
**Cause** : Rate limiting actif (protection brute force)

**Solution** :
- Attendre 15 minutes
- Ou temporairement désactiver rate limiting en dev :
```javascript
// server.js (temporaire)
if (process.env.NODE_ENV !== 'production') {
  // Désactiver rate limiting en dev
}
```

### Erreur : Database connection failed
**Solution** :
1. Vérifier que PostgreSQL est actif sur Render
2. Vérifier les variables `DATABASE_URL`, `DB_HOST`, etc.
3. Vérifier le plan gratuit (limitation 90 jours)

---

## 📞 Support

En cas de problème :
1. **Logs backend** : Dashboard Render → Service "luchnos" → Logs
2. **Logs frontend** : Console navigateur (F12)
3. **Email** : Luchnos2020@gmail.com

---

## 🎯 Prochaines Étapes (Optionnel)

### Amélioration Continue
1. **Monitoring** : Intégrer Sentry pour tracking erreurs
2. **Logging** : Remplacer console.log par Winston
3. **2FA** : Authentification à deux facteurs
4. **Argon2id** : Migrer de bcrypt vers Argon2id
5. **Backup automatique** : Snapshot PostgreSQL quotidien

### Documentation
1. **API Documentation** : Générer avec Swagger/OpenAPI
2. **Guide utilisateur** : Créer manuel admin
3. **Runbook** : Procédures d'urgence

---

**Date de création** : 2024  
**Dernière mise à jour** : Après implémentation JWT refresh tokens  
**Version** : 2.0 (Sécurité renforcée)
