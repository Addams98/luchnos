# ☁️ Configuration Cloudinary pour Luchnos

## 🎯 Problème Résolu

Sur Render, le système de fichiers est **éphémère** : les fichiers uploadés dans `/uploads` disparaissent à chaque redéploiement. 

**Solution** : Utiliser **Cloudinary** (CDN gratuit) pour stocker images et PDFs de manière permanente.

---

## 📝 Étape 1 : Créer un compte Cloudinary (GRATUIT)

1. Allez sur : https://cloudinary.com/users/register_free
2. Créez un compte (email + mot de passe)
3. Confirmez votre email
4. Accédez au **Dashboard** : https://console.cloudinary.com/

---

## 🔑 Étape 2 : Récupérer les identifiants

Sur le Dashboard Cloudinary, vous verrez :

```
Cloud name:    dxxxxxxxx
API Key:       123456789012345
API Secret:    abcdefgh_1234567890ABCDEF
```

**Copiez ces 3 valeurs** (bouton "Eye" pour révéler API Secret).

---

## ⚙️ Étape 3 : Ajouter les variables sur Render

**Dashboard Render → Service "luchnos" (backend) → Environment**

Ajoutez ces 3 variables d'environnement :

| Variable | Valeur (exemple) | Description |
|----------|------------------|-------------|
| `CLOUDINARY_CLOUD_NAME` | `dxxxxxxxx` | Nom de votre cloud |
| `CLOUDINARY_API_KEY` | `123456789012345` | Clé API publique |
| `CLOUDINARY_API_SECRET` | `abcdefgh_1234567890ABCDEF` | Clé API secrète |

**Cliquez "Save Changes"** → Render va redéployer automatiquement (2-3min)

---

## ✅ Étape 4 : Vérification

Une fois le redéploiement terminé, vérifiez les logs :

**Dashboard Render → Service "luchnos" → Logs**

Recherchez :
```
☁️ Cloudinary configuré: ✅
📦 Système d'upload images: Cloudinary ☁️
```

**Si vous voyez** :
```
☁️ Cloudinary configuré: ⚠️ Variables manquantes
📦 Système d'upload images: Local 💾
```
→ Vérifiez que les 3 variables sont bien définies (orthographe exacte)

---

## 🧪 Étape 5 : Tester l'upload

1. Connectez-vous à l'admin : `/admin/login`
2. Allez sur **Livres** ou **Événements**
3. Créez un nouveau livre avec une image
4. L'URL de l'image devrait ressembler à :
   ```
   https://res.cloudinary.com/dxxxxxxxx/image/upload/v123456789/luchnos/livres/livre_xxx.jpg
   ```
   Au lieu de : `/uploads/livres/livre_xxx.jpg`

---

## 📂 Organisation Cloudinary

Les fichiers sont organisés automatiquement :

```
luchnos/
  ├── livres/           # Couvertures de livres (800x1200 optimisé)
  ├── evenements/       # Images d'événements (1200x800)
  ├── versets/          # Hero carousel (1920x1080)
  ├── pensees/          # Pensées du jour (600x600)
  └── pdfs/             # Livres téléchargeables (PDF)
```

---

## 🔄 Migration des images existantes

Si vous avez déjà des images en local, voici comment migrer :

### Option A : Re-upload manuellement (Recommandé)

1. Allez sur chaque livre/événement dans l'admin
2. Cliquez **"Modifier"**
3. Re-uploadez l'image (elle ira sur Cloudinary)
4. Sauvegardez

### Option B : Script de migration automatique

```bash
# Dans backend/
node scripts/migrate-images-to-cloudinary.js
```

(Script à créer si besoin)

---

## 💰 Limites Gratuites Cloudinary

Le plan **FREE** de Cloudinary offre :

- ✅ **25 GB de stockage**
- ✅ **25 GB de bande passante/mois**
- ✅ **Transformation d'images illimitées**
- ✅ **Optimisation automatique (WebP, compression)**
- ✅ **CDN mondial (livraison ultra-rapide)**

**Largement suffisant** pour Luchnos (estimation : ~2000 images + 100 PDFs = ~5 GB)

---

## 🔧 Fallback Local

Si Cloudinary n'est **pas configuré**, le système **bascule automatiquement** sur le stockage local (`/uploads`) :

- ✅ Fonctionne en développement (localhost)
- ⚠️ Ne fonctionne PAS en production Render (fichiers éphémères)

**Donc en production, Cloudinary est OBLIGATOIRE.**

---

## 🐛 Dépannage

### Problème 1 : "Variables manquantes"
**Cause** : Variables mal nommées ou non définies sur Render
**Solution** : Vérifiez l'orthographe exacte :
- `CLOUDINARY_CLOUD_NAME` (avec underscore)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Problème 2 : "Upload failed"
**Cause** : Clé API incorrecte ou expirée
**Solution** : Re-générez l'API Secret sur Cloudinary Dashboard → Settings → Security

### Problème 3 : Images toujours pas affichées
**Cause** : Anciennes URLs locales en base de données
**Solution** : Re-uploadez les images ou utilisez le script de migration

---

## 📚 Documentation

- Cloudinary Docs : https://cloudinary.com/documentation
- Node.js SDK : https://cloudinary.com/documentation/node_integration
- Multer Storage : https://github.com/affanshahid/multer-storage-cloudinary

---

## 🎉 Avantages Cloudinary

1. **Permanence** : Fichiers jamais perdus (même après redéploiement)
2. **Performance** : CDN mondial = chargement ultra-rapide
3. **Optimisation** : Compression automatique + conversion WebP
4. **Sécurité** : HTTPS, transformation d'images sécurisée
5. **Backup** : Sauvegarde automatique, versioning

---

## 🚀 Prochaines Étapes

1. ✅ Créer compte Cloudinary (5 min)
2. ✅ Ajouter 3 variables sur Render (2 min)
3. ✅ Attendre redéploiement Render (3 min)
4. ✅ Tester upload d'image (1 min)
5. ✅ Re-uploader images existantes si nécessaire

**Total : ~15 minutes pour résoudre le problème définitivement !**
