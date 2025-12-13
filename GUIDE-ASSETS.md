# 📸 Guide des Assets & Images

## Dossier des Images

Toutes les images doivent être placées dans :
```
C:\Luchnos\frontend\public\assets\
```

## Images Nécessaires

### Logo Principal
- **Fichier** : `logo-luchnos_variant_1.png`
- **Taille recommandée** : 200x200px (transparent)
- **Format** : PNG avec fond transparent
- **Utilisation** : Header et Footer

### Hero Carousel
- **Fichier** : `hero-banner-lamp.jpg`
- **Taille recommandée** : 1920x1080px
- **Format** : JPG haute qualité
- **Utilisation** : Bannière principale carousel

### Événements
- **Fichier** : `event-community.jpg`
- **Taille recommandée** : 800x600px
- **Format** : JPG
- **Utilisation** : Images des événements

### Livres
- **Fichier** : `book-cover-3d.jpg`
- **Taille recommandée** : 600x900px (format livre)
- **Format** : JPG
- **Utilisation** : Couvertures de livres

### Images par Défaut
Si vous n'avez pas d'images, le site affichera :
- Icônes FontAwesome pour les placeholders
- Dégradés de couleur de la charte graphique

## Comment Ajouter une Image

### 1. Via le Système de Fichiers
```powershell
# Créer le dossier assets s'il n'existe pas
New-Item -ItemType Directory -Path "C:\Luchnos\frontend\public\assets" -Force

# Copier vos images
Copy-Item "chemin\vers\votre\image.jpg" "C:\Luchnos\frontend\public\assets\"
```

### 2. Dans la Base de Données

Pour ajouter des images aux contenus, utilisez les chemins relatifs :

```sql
-- Pour un événement
UPDATE evenements 
SET image_url = '/assets/mon-evenement.jpg' 
WHERE id = 1;

-- Pour un livre
UPDATE livres 
SET image_couverture = '/assets/ma-couverture.jpg' 
WHERE id = 1;

-- Pour une vidéo
UPDATE multimedia 
SET thumbnail_url = '/assets/ma-miniature.jpg' 
WHERE id = 1;
```

## Optimisation des Images

### Avant de les ajouter :

1. **Redimensionner** selon les tailles recommandées
2. **Compresser** avec un outil comme TinyPNG
3. **Format** :
   - JPG pour les photos
   - PNG pour les logos et transparence
   - WebP pour la meilleure qualité/taille

### Outils Recommandés
- **Photoshop / GIMP** - Édition professionnelle
- **TinyPNG** - Compression en ligne
- **Squoosh** - Outil Google de compression

## Icônes

Le site utilise **React Icons** (FontAwesome) :
- Pas besoin d'images pour les icônes
- Toujours nettes (vectorielles)
- Personnalisables en CSS

## Sources d'Images Gratuites

Si vous avez besoin d'images temporaires :

### Photos
- [Unsplash](https://unsplash.com/) - Photos haute qualité
- [Pexels](https://pexels.com/) - Photos gratuites
- [Pixabay](https://pixabay.com/) - Images libres

### Icônes
- [FontAwesome](https://fontawesome.com/) - Déjà intégré
- [Heroicons](https://heroicons.com/) - Icônes modernes

### Recherche Recommandée
Mots-clés pour trouver des images adaptées :
- "church" / "église"
- "bible study" / "étude biblique"
- "prayer" / "prière"
- "worship" / "louange"
- "christian community" / "communauté chrétienne"

## Structure Recommandée

```
frontend/public/assets/
├── logos/
│   ├── logo-luchnos_variant_1.png
│   └── logo-luchnos_white.png
├── heroes/
│   ├── hero-banner-lamp.jpg
│   └── hero-banner-bible.jpg
├── events/
│   ├── event-community.jpg
│   ├── conference-2024.jpg
│   └── seminaire-formation.jpg
├── books/
│   ├── book-cover-3d.jpg
│   └── mysteres-royaume.jpg
└── videos/
    └── thumbnails/
        ├── video-1.jpg
        └── video-2.jpg
```

## Dimensions Idéales par Type

| Type | Largeur | Hauteur | Ratio |
|------|---------|---------|-------|
| Hero Banner | 1920px | 1080px | 16:9 |
| Couverture Livre | 600px | 900px | 2:3 |
| Thumbnail Vidéo | 1280px | 720px | 16:9 |
| Événement | 800px | 600px | 4:3 |
| Logo | 200px | 200px | 1:1 |

## Upload en Production

### Via FTP/SFTP
```
Connectez-vous à votre serveur
Uploadez dans : /public/assets/
```

### Via Panel Admin (à développer)
Créer un système d'upload dans l'admin React

### Via CDN (Recommandé)
Pour de meilleures performances :
- Cloudinary
- Amazon S3
- Uploadcare

## Gestion des Images Manquantes

Le code gère automatiquement les images manquantes :
```jsx
// Exemple dans le code
{event.image_url ? (
  <img src={event.image_url} alt={event.titre} />
) : (
  <div className="placeholder-icon">
    <FaCalendarAlt />
  </div>
)}
```

## Checklist Avant Déploiement

- [ ] Toutes les images sont optimisées
- [ ] Les chemins dans la DB sont corrects
- [ ] Les images sont dans le bon format
- [ ] Les images respectent la charte graphique
- [ ] Backup des images originales fait

## Copyright

⚠️ **Important** : Assurez-vous d'avoir les droits sur toutes les images utilisées.

### Images Recommandées
- Photos prises par votre équipe
- Images libres de droits (CC0)
- Images achetées avec licence commerciale

---

**Besoin d'aide pour optimiser vos images ?**
Consultez la section Support du README.md
