# 📦 Fichiers de Déploiement Render

Ce dossier contient tous les fichiers nécessaires pour déployer Luchnos sur Render.

## 📄 Fichiers Créés

### Configuration
- ✅ `render.yaml` - Configuration Blueprint Render (optionnel)
- ✅ `DEPLOIEMENT-RENDER.md` - Guide complet de déploiement
- ✅ `DEPLOIEMENT-SIMPLE-5JOURS.md` - Guide rapide pour 5 jours
- ✅ `init-render-db.sql` - Script d'initialisation PostgreSQL
- ✅ `prepare-render.ps1` - Script de préparation automatique

### Backend
- ✅ `backend/.env.example` - Variables d'environnement mises à jour
- ✅ `backend/config/database.js` - Support DATABASE_URL (Render)
- ✅ `backend/server.js` - CORS configuré pour production

### Utilitaires
- ✅ `keep-alive.html` - Page pour maintenir le backend actif
- ✅ `package.json` - Scripts de déploiement root

## 🚀 Démarrage Rapide

### Méthode 1: Automatique (Recommandé)

```powershell
# Exécuter le script de préparation
.\prepare-render.ps1

# Suivre les instructions affichées
```

### Méthode 2: Manuel

```powershell
# 1. Initialiser Git
git init
git add .
git commit -m "Prêt pour Render"

# 2. Créer repository GitHub
# Aller sur https://github.com/new

# 3. Pousser le code
git remote add origin https://github.com/VOTRE_USERNAME/luchnos.git
git branch -M main
git push -u origin main

# 4. Suivre DEPLOIEMENT-SIMPLE-5JOURS.md
```

## 📋 Checklist Pré-Déploiement

- [ ] Code poussé sur GitHub
- [ ] Fichiers de configuration vérifiés
- [ ] `.env` non inclus dans Git (sécurité)
- [ ] Tests locaux réussis
- [ ] Documentation lue

## 🌐 URLs Après Déploiement

| Service | URL |
|---------|-----|
| Frontend | `https://luchnos-frontend.onrender.com` |
| Backend | `https://luchnos-backend.onrender.com` |
| Admin | `https://luchnos-frontend.onrender.com/admin/login` |
| Keep-Alive | Héberger `keep-alive.html` quelque part |

## 🔐 Credentials Par Défaut

**Admin Dashboard:**
- Email: `admin@luchnos.com`
- Password: `Admin@123`

⚠️ **Changez immédiatement le mot de passe après le premier login!**

## 💡 Conseils

### Pour 5 Jours
1. Déployez tout (15-20 min)
2. Testez immédiatement
3. Utilisez keep-alive.html pour éviter le sommeil du backend
4. Backup des données avant suppression (si nécessaire)

### Pour Plus de 90 Jours
- Le plan gratuit expire après 90 jours pour PostgreSQL
- Backend/Frontend peuvent rester gratuits indéfiniment
- Option: Migrer vers un autre hébergeur DB gratuit

## 📊 Limitations Plan Gratuit

| Ressource | Limite |
|-----------|--------|
| PostgreSQL | 1 GB, 90 jours |
| Backend | 750h/mois (suffisant) |
| Sommeil | Après 15 min inactivité |
| Bande passante | 100 GB/mois |
| Build time | 500 min/mois |

**Pour 5 jours: Aucune limitation! ✅**

## 🐛 Dépannage Rapide

### Backend 502
```
Attendre 60s → Backend se réveille
```

### CORS Error
```javascript
// backend/server.js
origin: ['https://luchnos-frontend.onrender.com']
```

### Build Failed
```powershell
# Tester localement d'abord
cd frontend
npm run build
```

## 📞 Support

- **Documentation Render**: https://render.com/docs
- **Community**: https://community.render.com
- **Dashboard**: https://dashboard.render.com

## ✅ Après Déploiement

1. ✅ Tester le site public
2. ✅ Se connecter à l'admin
3. ✅ Changer le mot de passe admin
4. ✅ Uploader quelques contenus test
5. ✅ Vérifier les uploads de fichiers
6. ✅ Tester le formulaire de contact
7. ✅ Activer keep-alive si nécessaire

---

**Prêt à déployer! Bonne chance! 🕯️**

*Dernière mise à jour: 13 décembre 2025*
