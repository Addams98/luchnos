# Instructions pour nettoyer les vidéos en double

## Problème identifié :
- ✅ 100 vidéos en base de données
- ❌ Toutes les vidéos sont en double (IDs 1-50 sont les originaux, IDs 51-100 sont les doublons)
- ❌ Caractères spéciaux incorrects : `&#39;` au lieu de `'` et `'` au lieu de `'`

## Solution :

### Option 1 : Via Render Dashboard (RECOMMANDÉ)

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre base de données **luchnos_db**
3. Cliquez sur l'onglet **"Connect"** puis **"External Connection"**
4. Copiez la **External Database URL**
5. Ouvrez **PSQL Shell** (ou utilisez un client comme DBeaver, pgAdmin)
6. Connectez-vous avec l'URL copiée
7. Exécutez le script SQL suivant :

```sql
BEGIN;

-- Supprimer les doublons (IDs 51-100)
DELETE FROM multimedia WHERE id BETWEEN 51 AND 100;

-- Corriger les caractères spéciaux
UPDATE multimedia
SET 
  titre = REPLACE(REPLACE(REPLACE(titre, '&#39;', ''''), ''', ''''), ''', ''''),
  description = CASE 
    WHEN description IS NOT NULL 
    THEN REPLACE(REPLACE(REPLACE(description, '&#39;', ''''), ''', ''''), ''', '''')
    ELSE description
  END;

-- Vérification
SELECT COUNT(*) as total_videos FROM multimedia;

COMMIT;
```

### Option 2 : Via l'API Admin (si vous avez le mot de passe admin)

1. Connectez-vous au dashboard admin: https://luchnos-frontend-web.onrender.com/admin/login
2. Allez dans la section **Multimédia**
3. Supprimez manuellement les vidéos en double (IDs 51-100)

### Option 3 : Script Node.js avec token valide

Si vous connaissez le mot de passe admin actuel, exécutez :

```bash
cd C:\Luchnos\backend
node ../clean-videos.js
```

Le script vous demandera vos identifiants admin.

## Résultat attendu :
- 50 vidéos uniques au lieu de 100
- Tous les titres avec des apostrophes correctes (`'` au lieu de `&#39;` ou `'`)

## Vérification après nettoyage :
```bash
cd C:\Luchnos\backend
node ../check-videos-api.js
```

Devrait afficher 50 vidéos sans doublons ni caractères spéciaux.
