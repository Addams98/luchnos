# 🎨 Charte Graphique - Lampe Allumée (Luchnos)

## 📸 Logo
![Logo Luchnos](frontend/public/assets/logo.png)

**Description :** Logo circulaire avec une lampe à huile en bronze/cuivre et une flamme lumineuse sur fond bleu marine. Le texte "LAMPE ALLUMÉE (LUCHNOS)" apparaît en doré en haut, et "Présenter Yéhoshoua car IL revient" en bas.

---

## 🎨 Palette de Couleurs Principale

### Couleur Dominante
- **Bleu Marine Foncé** : `#2c3e50`
  - Usage : Fond principal, headers, sections importantes
  - RGB : `rgb(44, 62, 80)`
  - Symbolisme : Profondeur, sagesse, spiritualité

### Couleurs d'Accent

#### Or/Doré
- **Or Principal** : `#f4c430`
  - Usage : Titres principaux, boutons CTA, liens importants
  - RGB : `rgb(244, 196, 48)`
  - Symbolisme : Lumière divine, valeur, gloire

#### Cuivré/Bronze
- **Bronze/Cuivré** : `#cd7f32`
  - Usage : Éléments décoratifs, icônes, bordures
  - RGB : `rgb(205, 127, 50)`
  - Symbolisme : Tradition, solidité, héritage

#### Flamme (Accents Lumineux)
- **Jaune Flamme** : `#fff44f`
  - Usage : Surbrillance, effets de glow, animations
  - RGB : `rgb(255, 244, 79)`
  - Symbolisme : Lumière, révélation, illumination

- **Orange Flamme** : `#ff6b35`
  - Usage : Appels à l'action secondaires, badges, alertes
  - RGB : `rgb(255, 107, 53)`
  - Symbolisme : Énergie, passion, zèle

---

## 🔤 Typographie

### Polices Principales
- **Titres & Headers** : 
  - Nom : **Cinzel** ou **Playfair Display** (alternative : **Georgia**)
  - Style : Serif élégant, rappelant les textes anciens
  - Poids : Bold (700) pour les titres, Regular (400) pour les sous-titres

- **Corps de Texte** :
  - Nom : **Inter** (alternative : **Open Sans**)
  - Style : Sans-serif moderne, excellent pour la lisibilité
  - Poids : Regular (400), Medium (500), SemiBold (600)

### Hiérarchie Typographique
```css
h1 { font-size: 3rem; font-weight: 700; color: #f4c430; }
h2 { font-size: 2.25rem; font-weight: 600; color: #f4c430; }
h3 { font-size: 1.875rem; font-weight: 600; color: #cd7f32; }
p  { font-size: 1rem; line-height: 1.75; color: #e2e8f0; }
```

---

## 🎭 Style Visuel

### Atmosphère Générale
- **Sobre et Lumineux** : Équilibre entre l'élégance sombre et les touches dorées lumineuses
- **Spirituel et Inspirant** : Évoque la foi, l'espérance et la révélation
- **Moderne et Accessible** : Design contemporain tout en respectant la tradition

### Effets et Traitements

#### Ombres
```css
/* Ombre douce */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Effet glow doré */
box-shadow: 0 0 20px rgba(244, 196, 48, 0.3);

/* Effet flamme */
box-shadow: 0 0 30px rgba(255, 244, 79, 0.5);
```

#### Gradients
```css
/* Gradient principal (bleu marine) */
background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);

/* Gradient doré */
background: linear-gradient(135deg, #f4c430 0%, #d4a017 100%);

/* Gradient flamme */
background: radial-gradient(circle, #fff44f 0%, #ff6b35 100%);
```

#### Bordures et Séparateurs
- **Bordures dorées** : `1px solid #f4c430`
- **Bordures cuivrées** : `2px solid #cd7f32`
- **Lignes de séparation** : `1px solid rgba(244, 196, 48, 0.2)`

---

## 🖼️ Iconographie

### Style des Icônes
- **Type** : Line icons avec remplissage optionnel
- **Couleur** : Or (`#f4c430`) pour les icônes actives
- **Taille** : 24px (standard), 32px (grandes sections), 48px (hero)

### Icônes Thématiques
- 🕯️ **Lampe/Flamme** : Symbolise l'illumination spirituelle
- 📖 **Livre** : Représente les éditions et ressources
- 🎥 **Caméra** : Pour la section multimédia
- 📅 **Calendrier** : Événements à venir
- ✉️ **Enveloppe** : Contact et newsletter

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Téléphones en paysage */
md: 768px   /* Tablettes */
lg: 1024px  /* Petits ordinateurs */
xl: 1280px  /* Ordinateurs standards */
2xl: 1536px /* Grands écrans */
```

### Adaptations
- **Mobile** : Navigation hamburger, cards en colonne unique
- **Tablette** : Grid 2 colonnes, sidebar responsive
- **Desktop** : Layout complet, animations avancées

---

## 🎯 Composants UI

### Boutons

#### Bouton Principal (CTA)
```css
background: linear-gradient(135deg, #f4c430 0%, #d4a017 100%);
color: #2c3e50;
padding: 12px 32px;
border-radius: 8px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(244, 196, 48, 0.3);
transition: all 0.3s ease;

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(244, 196, 48, 0.4);
```

#### Bouton Secondaire
```css
background: transparent;
border: 2px solid #cd7f32;
color: #cd7f32;
padding: 10px 28px;
border-radius: 8px;
transition: all 0.3s ease;

/* Hover */
background: #cd7f32;
color: white;
```

### Cards
```css
background: rgba(44, 62, 80, 0.8);
border: 1px solid rgba(244, 196, 48, 0.1);
border-radius: 12px;
padding: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
backdrop-filter: blur(10px);
transition: all 0.3s ease;

/* Hover */
border-color: #f4c430;
transform: translateY(-4px);
box-shadow: 0 12px 40px rgba(244, 196, 48, 0.2);
```

### Formulaires
```css
/* Input fields */
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(244, 196, 48, 0.2);
border-radius: 8px;
padding: 12px 16px;
color: #e2e8f0;
transition: all 0.3s ease;

/* Focus */
border-color: #f4c430;
box-shadow: 0 0 0 3px rgba(244, 196, 48, 0.1);
```

---

## ✨ Animations

### Transitions Standard
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animations Spéciales
```css
/* Effet flamme scintillante */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Glow pulsant */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(244, 196, 48, 0.3); }
  50% { box-shadow: 0 0 40px rgba(244, 196, 48, 0.6); }
}

/* Apparition douce */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🌟 Applications de la Charte

### Header/Navigation
- Fond : `#2c3e50` avec légère transparence
- Logo : Or `#f4c430`
- Liens : Blanc avec hover doré
- Bordure inférieure : `1px solid rgba(244, 196, 48, 0.2)`

### Hero Section
- Fond : Gradient `#2c3e50` → `#34495e`
- Titre : Or `#f4c430` avec effet glow
- Sous-titre : Blanc `#ffffff`
- CTA : Bouton doré avec ombre

### Sections de Contenu
- Fond alterné : Blanc et gris très clair
- Titres : Or `#f4c430`
- Texte : Gris foncé `#2c3e50`
- Accents : Cuivré `#cd7f32`

### Footer
- Fond : `#2c3e50`
- Texte : Gris clair `#cbd5e1`
- Liens : Or `#f4c430` au hover
- Icônes sociales : Cuivré `#cd7f32`

---

## 📋 Checklist d'Application

- [ ] Logo placé dans le header (coin gauche)
- [ ] Favicon généré à partir du logo
- [ ] Couleurs principales appliquées à tous les composants
- [ ] Typographie Cinzel/Inter importée et appliquée
- [ ] Effets glow appliqués aux éléments importants
- [ ] Boutons stylisés selon la charte
- [ ] Cards avec bordures et ombres dorées
- [ ] Animations de flamme sur les éléments clés
- [ ] Responsive testé sur mobile/tablette/desktop
- [ ] Contraste et accessibilité vérifiés

---

## 🎨 Palette Complète (Tailwind)

```javascript
colors: {
  primary: {
    DEFAULT: '#2c3e50',
    dark: '#1a252f',
    light: '#34495e'
  },
  gold: {
    DEFAULT: '#f4c430',
    dark: '#d4a017',
    light: '#ffd700'
  },
  copper: {
    DEFAULT: '#cd7f32',
    dark: '#b8860b',
    light: '#daa520'
  },
  flame: {
    yellow: '#fff44f',
    orange: '#ff6b35',
    glow: '#ffeb3b'
  }
}
```

---

**Créé le :** 29 Novembre 2025  
**Version :** 2.0.0  
**Basé sur :** Logo officiel Lampe Allumée (Luchnos)
