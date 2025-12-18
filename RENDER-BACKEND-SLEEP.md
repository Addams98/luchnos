# Backend Render - Plan Gratuit

## Problème CORS / Backend Inaccessible

### Symptômes
- Erreurs CORS dans la console: `No 'Access-Control-Allow-Origin' header`
- Message: `Failed to load resource: net::ERR_FAILED`
- Backend inaccessible: Network Error

### Cause
Le plan **gratuit de Render** met automatiquement les services en veille après **15 minutes d'inactivité**. Quand un utilisateur essaie d'accéder au site, le backend est endormi et ne peut pas répondre aux requêtes.

### Solution Automatique
Le site inclut maintenant un composant `BackendStatus` qui:
1. Détecte automatiquement quand le backend est down
2. Affiche un bandeau d'information en haut de la page
3. Essaie de réveiller le backend toutes les 10 secondes
4. Informe l'utilisateur de la durée estimée (30-60 secondes)

### Solution Manuelle
Si vous voyez l'erreur dans la console:
1. Visitez `https://luchnos.onrender.com/api/health` dans votre navigateur
2. Attendez 30-60 secondes que le service démarre
3. Rechargez la page du site
4. Le backend sera maintenant actif

### Temps de Réveil
- **Premier réveil**: 30-60 secondes
- **Requêtes suivantes**: Instantanées (tant que le service reste actif)
- **Nouvelle mise en veille**: Après 15 minutes d'inactivité

### Pour Éviter Ce Problème

#### Option 1: Upgrade vers Render Paid (7$/mois)
- Pas de mise en veille automatique
- Service toujours actif
- Performances garanties

#### Option 2: Keep-Alive Service
Utilisez un service comme **UptimeRobot** ou **Cron-Job.org** pour:
- Pinger `https://luchnos.onrender.com/api/health` toutes les 10 minutes
- Maintenir le backend actif en permanence
- Gratuit et automatique

#### Configuration UptimeRobot
1. Créez un compte sur uptimerobot.com
2. Ajoutez un nouveau moniteur HTTP(s)
3. URL: `https://luchnos.onrender.com/api/health`
4. Intervalle: 10 minutes
5. Le backend restera actif 24/7

### Vérification du Statut
Vous pouvez toujours vérifier l'état du backend en visitant:
- Health Check: https://luchnos.onrender.com/api/health
- API Root: https://luchnos.onrender.com/

### Logs Render
Pour voir pourquoi le backend est down:
1. Allez sur render.com dashboard
2. Sélectionnez le service "luchnos" (backend)
3. Consultez l'onglet "Logs"
4. Cherchez les erreurs ou crashes

### Variables d'Environnement Requises sur Render
Vérifiez que ces variables sont définies:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret pour les tokens
- `CLOUDINARY_CLOUD_NAME` (optionnel)
- `CLOUDINARY_API_KEY` (optionnel)
- `CLOUDINARY_API_SECRET` (optionnel)
- `NODE_ENV=production`

### Support
Si le problème persiste même après 2-3 minutes d'attente:
1. Vérifiez les logs Render pour les erreurs
2. Vérifiez que PostgreSQL est bien connecté
3. Vérifiez que JWT_SECRET est défini
4. Redéployez manuellement depuis Render dashboard
