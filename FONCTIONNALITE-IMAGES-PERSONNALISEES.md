# Fonctionnalité : Images Personnalisées pour Versets et Pensées

## Vue d'ensemble
Les administrateurs peuvent maintenant définir des images de fond personnalisées pour chaque verset biblique et pensée affichés dans le carrousel de la page d'accueil.

## Changements de Base de Données

### Tables Modifiées
- **versets_hero** : Ajout de la colonne `image_url VARCHAR(500)`
- **pensees** : Ajout de la colonne `image_url VARCHAR(500)`

### Migration SQL
Fichier : `backend/migrations/add_image_url_columns.sql`
```sql
ALTER TABLE versets_hero ADD COLUMN image_url VARCHAR(500) AFTER reference;
ALTER TABLE pensees ADD COLUMN image_url VARCHAR(500) AFTER contenu;
```

## Changements Backend

### Routes Admin Modifiées
Fichier : `backend/routes/admin.js`

#### Versets
- **POST /api/admin/versets** : Accepte maintenant `image_url` dans le body
- **PUT /api/admin/versets/:id** : Supporte la mise à jour de `image_url`

#### Pensées
- **POST /api/admin/pensees** : Accepte maintenant `image_url` dans le body
- **PUT /api/admin/pensees/:id** : Supporte la mise à jour de `image_url`

### Exemple de Requête
```javascript
{
  "texte": "Car Dieu a tant aimé le monde...",
  "reference": "Jean 3:16",
  "image_url": "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600",
  "actif": true,
  "ordre": 1
}
```

## Changements Frontend

### Interface Admin

#### Versets (`frontend/src/pages/admin/Versets.jsx`)
- Nouveau champ "URL de l'image de fond (optionnel)"
- Validation de type URL
- Message d'aide : "Si aucune image n'est fournie, une image par défaut sera utilisée"

#### Pensées (`frontend/src/pages/admin/Pensees.jsx`)
- Nouveau champ "URL de l'image de fond (optionnel)"
- Validation de type URL
- Message d'aide identique

### Carrousel (`frontend/src/components/HeroCarousel.jsx`)
- Utilise `verset.image_url` ou image par défaut pour les versets
- Utilise `pensee.image_url` ou image par défaut pour les pensées

#### Images par Défaut
- **Versets** : `https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600` (Bible ouverte)
- **Pensées** : `https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600` (Ciel/Lumière)

## Utilisation

### Ajout d'une Image Personnalisée

1. **Via l'Admin Versets/Pensées**
   - Créer ou modifier un verset/pensée
   - Coller l'URL complète de l'image dans le champ "URL de l'image de fond"
   - L'URL doit être accessible publiquement (HTTPS recommandé)
   - Formats recommandés : JPG, PNG, WebP
   - Dimensions recommandées : 1600x900px minimum

2. **Sources d'Images Suggérées**
   - Unsplash : https://unsplash.com/ (gratuit, haute qualité)
   - Pexels : https://www.pexels.com/ (gratuit)
   - Images propres hébergées sur un CDN

### Exemple de Workflow

```javascript
// 1. Admin crée un verset avec image personnalisée
POST /api/admin/versets
{
  "texte": "Je suis la lumière du monde",
  "reference": "Jean 8:12",
  "image_url": "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  "actif": true,
  "ordre": 1
}

// 2. L'image apparaît automatiquement dans le carrousel
// 3. Si l'URL est invalide ou vide, l'image par défaut est utilisée
```

## Validation

### Backend
- `image_url` est optionnel (peut être NULL)
- Aucune validation de format côté serveur (délégué au frontend)
- Si vide, NULL est stocké dans la base de données

### Frontend
- Type `url` sur le champ input HTML
- Validation native du navigateur
- Gestion d'erreur : image par défaut si URL invalide/non chargeable

## Compatibilité

- ✅ Les versets/pensées existants sans `image_url` continuent de fonctionner avec les images par défaut
- ✅ Aucune migration de données nécessaire pour les enregistrements existants
- ✅ Rétrocompatible avec l'interface admin existante

## Notes Techniques

### Performance
- Les images externes (Unsplash, etc.) sont chargées via CDN
- Pas de stockage local des images pour les versets/pensées
- Le navigateur cache les images automatiquement

### Sécurité
- Pas de risque XSS (images affichées via attribut `src` standard)
- HTTPS recommandé pour éviter les avertissements de contenu mixte
- Pas de validation d'existence d'image côté serveur (gestion côté client)

### Accessibilité
- Les images ont un rôle décoratif (fond de carrousel)
- Le texte reste lisible grâce à l'overlay sombre sur les images
- Pas d'impact sur le contenu accessible (texte des versets/pensées)

## Tests

### Scénarios à Tester

1. **Création avec image personnalisée**
   - Créer un verset avec une URL Unsplash
   - Vérifier l'affichage dans le carrousel

2. **Création sans image**
   - Créer un verset sans `image_url`
   - Vérifier que l'image par défaut s'affiche

3. **Modification d'image**
   - Modifier l'URL d'un verset existant
   - Vérifier le changement dans le carrousel

4. **URL invalide**
   - Entrer une URL invalide ou d'une image inexistante
   - Vérifier le fallback vers l'image par défaut

## Support

Pour toute question ou problème :
- Vérifier la console navigateur pour les erreurs de chargement d'images
- S'assurer que l'URL est accessible publiquement
- Utiliser des URLs HTTPS pour éviter les problèmes de sécurité

---

**Date d'implémentation** : Décembre 2025  
**Version** : 1.0.0
