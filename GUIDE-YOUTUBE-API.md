# 🎥 Guide d'Installation - API YouTube

## 📋 Prérequis

- Compte Google/Gmail
- Accès à Google Cloud Console
- Projet Luchnos fonctionnel (backend + frontend)

---

## 🔑 Étape 1 : Obtenir une Clé API YouTube

### 1. Créer un Projet Google Cloud

1. Allez sur : https://console.cloud.google.com
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Sélectionner un projet"** en haut
4. Cliquez sur **"NOUVEAU PROJET"**
5. Nom du projet : `Luchnos-YouTube`
6. Cliquez sur **"CRÉER"**

### 2. Activer l'API YouTube Data v3

1. Dans le menu de gauche, allez dans **"APIs et services"** > **"Bibliothèque"**
2. Recherchez : `YouTube Data API v3`
3. Cliquez sur **"YouTube Data API v3"**
4. Cliquez sur **"ACTIVER"**

### 3. Créer une Clé API

1. Dans le menu de gauche, allez dans **"APIs et services"** > **"Identifiants"**
2. Cliquez sur **"+ CRÉER DES IDENTIFIANTS"**
3. Sélectionnez **"Clé API"**
4. Une clé API sera générée (format : `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. **Copiez cette clé** (important !)

### 4. (Optionnel) Restreindre la Clé

Pour plus de sécurité :
1. Cliquez sur **"RESTREINDRE LA CLÉ"**
2. Sous "Restrictions relatives aux API", sélectionnez **"Limiter la clé"**
3. Cochez uniquement **"YouTube Data API v3"**
4. Cliquez sur **"ENREGISTRER"**

---

## ⚙️ Étape 2 : Configuration Backend

### 1. Modifier le fichier .env

Ouvrez `C:\Luchnos\backend\.env` et modifiez :

```env
# YouTube API Configuration
YOUTUBE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
# Remplacez par votre vraie clé API
```

**Remplacez `YOUR_API_KEY_HERE` par la clé copiée à l'étape 1.3**

### 2. Vérifier l'installation du package

```powershell
cd C:\Luchnos\backend
npm list googleapis
```

Si le package n'est pas installé :
```powershell
npm install googleapis
```

### 3. Redémarrer le Backend

```powershell
cd C:\Luchnos\backend
npm run dev
```

Vérifiez qu'il n'y a pas d'erreurs au démarrage.

---

## 📺 Étape 3 : Obtenir votre Channel ID YouTube

### Méthode 1 : Via YouTube Studio (Recommandé)

1. Allez sur : https://studio.youtube.com
2. Cliquez sur **"Paramètres"** (⚙️) en bas à gauche
3. Allez dans **"Chaîne"** > **"Paramètres avancés"**
4. Copiez l'**"ID de la chaîne YouTube"** (format : `UCxxxxxxxxxxxxxxxxxx`)

### Méthode 2 : Via l'URL de votre chaîne

1. Allez sur votre chaîne YouTube
2. L'URL est : `https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxx`
3. Copiez la partie après `/channel/`

### Méthode 3 : Via le Handle (si vous avez @votrenom)

Si votre URL est : `https://www.youtube.com/@votrenom`

Vous devez utiliser une des méthodes ci-dessus pour obtenir l'ID réel.

---

## 🎯 Étape 4 : Configuration Frontend (Admin)

### 1. Se Connecter à l'Admin

```
URL  : http://localhost:3000/admin/login
Email: admin@luchnos.com
Pass : Admin@123
```

### 2. Aller dans Paramètres

Dans le menu de gauche, cliquez sur **"⚙️ Paramètres"**

### 3. Configurer le Channel ID

Faites défiler jusqu'à **"Réseaux Sociaux"**

Trouvez le champ :
```
🎥 YouTube Channel ID (pour import automatique)
[UCxxxxxxxxxxxxxxxxxxxxx]
```

**Collez votre Channel ID** obtenu à l'étape 3.

### 4. Enregistrer

Cliquez sur **"💾 Enregistrer les paramètres"**

Vérifiez le message de succès.

---

## 🚀 Étape 5 : Test de la Synchronisation

### 1. Aller dans Multimédia

Dans le menu admin, cliquez sur **"🎥 Multimédia"**

### 2. Lancer la Synchronisation

Cliquez sur le bouton rouge **"🔴 Sync YouTube"** en haut à droite.

### 3. Résultats Attendus

**Message de succès :**
```
✅ Synchronisation terminée: 10 importées, 0 ignorées, 0 erreurs
```

**Si erreur :**
- ❌ Clé API YouTube non configurée → Vérifiez `.env`
- ❌ Channel ID non trouvé → Vérifiez le Channel ID dans Paramètres
- ❌ Quota dépassé → Attendez 24h (quota quotidien dépassé)

### 4. Vérifier les Vidéos

Scrollez dans la page Multimédia pour voir vos 10 dernières vidéos importées !

---

## 📊 Quotas YouTube API

### Limites Gratuites

- **10,000 unités par jour** par projet
- Une recherche = **100 unités**
- Détails vidéo = **1 unité**

**Notre sync utilise environ :**
- 1 recherche (100 unités)
- 10 détails vidéos (10 unités)
- **Total : ~110 unités par synchronisation**

👉 Vous pouvez synchroniser **environ 90 fois par jour** avec le quota gratuit.

### Augmenter le Quota

Si besoin, demandez une augmentation sur Google Cloud Console :
1. APIs et services > Quotas
2. Sélectionnez YouTube Data API v3
3. Demandez une augmentation (gratuit, traité sous 2-3 jours)

---

## 🔍 Résolution de Problèmes

### Erreur : "Clé API YouTube invalide"

**Causes possibles :**
1. Clé API mal copiée dans `.env`
2. API YouTube Data v3 non activée
3. Restrictions trop strictes sur la clé

**Solutions :**
1. Revérifiez la clé dans `.env` (pas d'espaces)
2. Activez l'API dans Google Cloud Console
3. Retirez les restrictions temporairement

### Erreur : "Channel ID non trouvé"

**Causes possibles :**
1. Channel ID incorrect
2. Chaîne privée ou supprimée

**Solutions :**
1. Revérifiez le Channel ID (commence par UC)
2. Testez avec une chaîne publique d'abord

### Erreur : "Quota dépassé"

**Message :**
```
quotaExceeded: The request cannot be completed because you have exceeded your quota
```

**Solution :**
Attendez jusqu'à minuit (heure du Pacifique) pour le reset du quota.

### Aucune Vidéo Trouvée

**Causes possibles :**
1. Chaîne sans vidéo publique
2. Vidéos en "Non répertoriée" ou "Privée"

**Solutions :**
1. Vérifiez que votre chaîne a des vidéos publiques
2. Testez avec une autre chaîne (ex: UC_x5XG1OV2P6uZZ5FSM9Ttw - Google Developers)

---

## 🎯 Tests Recommandés

### Test 1 : Connexion API

Dans PowerShell :
```powershell
# Test curl (remplacez YOUR_API_KEY)
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCxxxxxx&key=YOUR_API_KEY"
```

Résultat attendu : JSON avec infos de la chaîne

### Test 2 : Backend API

```powershell
# Test route backend
curl http://localhost:5000/api/youtube/test
```

Résultat attendu : `{ "success": true, "message": "Connexion YouTube API OK" }`

### Test 3 : Sync Manuelle

Via l'interface admin (décrit à l'étape 5)

---

## 📝 Utilisation Quotidienne

### Synchronisation Automatique (Future Feature)

Pour l'instant, la synchronisation est **manuelle** via le bouton.

**Planification future :**
- Cron job quotidien (backend)
- Synchronisation auto au démarrage
- Webhook YouTube (notifications push)

### Synchronisation Manuelle

**Fréquence recommandée :**
- 1 fois par jour pour les chaînes actives
- 1 fois par semaine pour les chaînes moins actives
- Après chaque upload de vidéo

**Processus :**
1. Admin → Multimédia
2. Clic sur "Sync YouTube"
3. Attendre 5-10 secondes
4. Vérifier le message de confirmation

---

## 🔐 Sécurité

### Protéger votre Clé API

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre clé API !

**Bonnes pratiques :**
1. ✅ Stockez dans `.env` (jamais dans le code)
2. ✅ Ajoutez `.env` à `.gitignore`
3. ✅ Utilisez des restrictions de clé
4. ✅ Régénérez la clé si compromise

### Fichier .gitignore

Vérifiez que `C:\Luchnos\backend\.gitignore` contient :
```
.env
node_modules/
uploads/
```

---

## 📚 Ressources Supplémentaires

### Documentation Officielle
- API YouTube Data v3 : https://developers.google.com/youtube/v3
- Google Cloud Console : https://console.cloud.google.com
- Quotas API : https://developers.google.com/youtube/v3/getting-started#quota

### Support
- Google Cloud Support : https://cloud.google.com/support
- Stack Overflow : Tag `youtube-api`

---

## ✅ Checklist Installation

- [ ] Compte Google créé
- [ ] Projet Google Cloud créé
- [ ] API YouTube Data v3 activée
- [ ] Clé API générée et copiée
- [ ] `.env` modifié avec la clé API
- [ ] Package `googleapis` installé
- [ ] Backend redémarré sans erreur
- [ ] Channel ID YouTube obtenu
- [ ] Channel ID configuré dans Admin Paramètres
- [ ] Premier test de synchronisation réussi
- [ ] Au moins 1 vidéo importée visible

---

## 🎉 Félicitations !

Votre système d'import automatique YouTube est maintenant **opérationnel** !

**Prochaines étapes suggérées :**
1. Testez avec votre vraie chaîne
2. Configurez une synchronisation quotidienne
3. Personnalisez les catégories automatiques
4. Ajoutez d'autres chaînes partenaires

**Besoin d'aide ?**
Consultez les logs backend : `C:\Luchnos\backend` (terminal)

---

**Date de création** : 29 Novembre 2025
**Version** : 1.0
**API utilisée** : YouTube Data API v3
