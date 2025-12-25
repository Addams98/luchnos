# Configuration Admin sur Render

## Problème
Le backend Render retourne 401 lors du login car aucun utilisateur admin n'existe dans la base de données PostgreSQL.

## Solution

### Étape 1: Ajouter la variable d'environnement sur Render

1. Aller sur [Render Dashboard](https://dashboard.render.com)
2. Sélectionner le service backend **luchnos**
3. Aller dans **Environment**
4. Ajouter une nouvelle variable:
   - **Clé**: `SETUP_SECRET`
   - **Valeur**: `LuchnosSetup2024!SecretKey`

### Étape 2: Redéployer le backend

Render va automatiquement redéployer après l'ajout de la variable.
Attendre 2-3 minutes que le déploiement se termine.

### Étape 3: Créer l'utilisateur admin

Utiliser PowerShell ou curl pour appeler la route de setup:

```powershell
$headers = @{'Content-Type' = 'application/json'}
$body = @{
  email = 'adams@luchnos.com'
  password = 'Addams@2024'
  secretKey = 'LuchnosSetup2024!SecretKey'
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "https://luchnos.onrender.com/api/setup-admin" `
  -Method POST `
  -Headers $headers `
  -Body $body `
  -UseBasicParsing
```

**OU** avec curl:

```bash
curl -X POST https://luchnos.onrender.com/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "adams@luchnos.com",
    "password": "Addams@2024",
    "secretKey": "LuchnosSetup2024!SecretKey"
  }'
```

### Étape 4: Tester le login

```powershell
$headers = @{'Content-Type' = 'application/json'}
$body = @{
  email = 'adams@luchnos.com'
  password = 'Addams@2024'
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "https://luchnos.onrender.com/api/auth/login" `
  -Method POST `
  -Headers $headers `
  -Body $body `
  -UseBasicParsing
```

Vous devriez recevoir une réponse 200 avec les tokens.

### Étape 5: IMPORTANT - Désactiver la route de setup

Une fois l'admin créé, **commenter** la route dans `backend/server.js`:

```javascript
// ⚠️ DÉSACTIVÉ APRÈS CRÉATION ADMIN
// app.use('/api/setup-admin', require('./routes/setup-admin'));
```

Et supprimer la variable `SETUP_SECRET` de Render pour plus de sécurité.

## Pourquoi ce problème ?

Sur Render, la base de données PostgreSQL est vide au départ. Contrairement au développement local où on peut exécuter des scripts SQL directement, sur Render il faut passer par l'API pour créer le premier utilisateur admin.

## Alternative

Si vous avez accès au shell PostgreSQL de Render (via la console externe ou un client comme pgAdmin), vous pouvez exécuter directement:

```sql
INSERT INTO utilisateurs (nom, email, password, role) 
VALUES (
    'Administrateur Luchnos',
    'adams@luchnos.com',
    '$2b$10$fVKWziKg.0XbYpbPe1qpYeaFkznCEXDlgcyk4tiMoATRXTaewHhqO',
    'admin'
);
```

Ce hash correspond au mot de passe `Addams@2024`.
