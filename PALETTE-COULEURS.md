# Palette de Couleurs Officielles - Lampe Allumée (Luchnos)

## Couleurs du Logo (Fournies par le Client)

### 🟦 1. Bleu Nuit (Fond)
**Couleur dominante du logo**
- **Primary**: `#191F34` - RGB(25, 31, 52)
- **Variante claire**: `#1C2235` - RGB(28, 34, 53)
- **Variante foncée**: `#1A2034` - RGB(26, 32, 52)

**Utilisation**: Fond principal, headers, textes sombres, navigation

### 🟡 2. Jaune Doré (Texte et Flamme)
**Couleur signature de la flamme**
- **Gold**: `#FFC100` - RGB(255, 193, 0)
- **Clair**: `#FFD700` - RGB(255, 215, 0)
- **Foncé**: `#E5AC00` - RGB(229, 172, 0)

**Utilisation**: Texte "LUCHNOS", flamme, boutons principaux, accents lumineux

### 🟠 3. Cuivre/Orange (Lampe)
**Couleur du récipient de la lampe**
- **Copper**: `#CC7447` - RGB(204, 116, 71)
- **Clair**: `#DC9664` - RGB(220, 150, 100)
- **Foncé (ombrages)**: `#9F4A15` - RGB(159, 74, 21)

**Utilisation**: Éléments secondaires, icônes, bordures, accents chaleureux

### ⚫ 4. Noir
**Contours et détails**
- **Noir**: `#000000` - RGB(0, 0, 0)

**Utilisation**: Contours fins, séparateurs, texte sur fond très clair

---

## Couleurs d'Accent (Harmonieuses avec le Logo)

### 🟢 Vert (Événements)
- **Green**: `#2D7A3E` - Pour carte Événements
- **Green Light**: `#3A9B51`

### 🟠 Orange (Contact)
- **Orange**: `#E67E22` - Pour carte Contact
- **Orange Light**: `#F39C12`

### 🟤 Terre Cuite
- **Terracotta**: `#B4643C` - Alternative

### 🔵 Bleu Clair
- **Light Blue**: `#3498DB` - Variation

---

## Dégradés Prédéfinis

### Dégradé Bleu Nuit (Primary)
```css
background: linear-gradient(135deg, #191F34 0%, #1C2235 100%);
```
**Classe Tailwind**: `bg-gradient-primary`

### Dégradé Doré
```css
background: linear-gradient(135deg, #FFC100 0%, #FFD700 100%);
```
**Classe Tailwind**: `bg-gradient-gold`

### Dégradé Flamme (Radial)
```css
background: radial-gradient(circle, #FFC100 0%, #FF8C00 60%, #FFD700 100%);
```
**Classe Tailwind**: `bg-gradient-flame`

### Dégradé Cuivre
```css
background: linear-gradient(135deg, #CC7447 0%, #9F4A15 100%);
```
**Classe Tailwind**: `bg-gradient-copper`

---

## Classes Tailwind Personnalisées

### Couleurs de Texte
- `text-primary` - Bleu nuit #191F34
- `text-gold` - Jaune doré #FFC100
- `text-copper` - Cuivre #CC7447

### Couleurs de Fond
- `bg-primary` - Bleu nuit #191F34
- `bg-gold` - Jaune doré #FFC100
- `bg-copper` - Cuivre #CC7447

### Bordures
- `border-primary` - Bleu nuit
- `border-gold` - Jaune doré
- `border-copper` - Cuivre

### Ombres Lumineuses
- `shadow-glow` - Lueur dorée légère
- `shadow-glow-lg` - Lueur dorée intense
- `shadow-flame` - Effet flamme

---

## Guide d'Utilisation

### Headers et Titres
```jsx
<h1 className="text-primary font-bold">Titre</h1>
<h2 className="text-gold">Sous-titre</h2>
```

### Boutons Principaux
```jsx
<button className="bg-gradient-gold text-white px-6 py-3 rounded-lg shadow-glow hover:shadow-flame">
  Action Principale
</button>
```

### Cartes
```jsx
<div className="card bg-white border-l-4 border-gold">
  {/* Contenu */}
</div>
```

### Icônes
```jsx
{/* Icône sur fond doré */}
<div className="bg-gold text-primary rounded-full p-4">
  <Icon />
</div>

{/* Icône sur fond bleu nuit */}
<div className="bg-primary text-gold rounded-full p-4">
  <Icon />
</div>
```

---

## Contraste et Accessibilité

### Combinaisons Recommandées

✅ **Excellent contraste**:
- Texte bleu nuit (#191F34) sur fond blanc
- Texte blanc sur fond bleu nuit (#191F34)
- Texte bleu nuit (#191F34) sur fond doré (#FFC100)
- Icône dorée (#FFC100) sur fond bleu nuit (#191F34)

✅ **Bon contraste**:
- Texte blanc sur fond cuivre (#CC7447)
- Texte cuivre foncé (#9F4A15) sur fond blanc

⚠️ **À éviter**:
- Texte doré sur fond blanc (faible contraste)
- Texte cuivre clair sur fond doré

---

## Notes Importantes

1. **Cohérence visuelle**: Toutes ces couleurs proviennent directement du logo officiel
2. **Hiérarchie**: Le bleu nuit (#191F34) est la couleur dominante (53.77% du logo)
3. **Signature**: Le jaune doré (#FFC100) est la couleur signature de la marque
4. **Chaleur**: Le cuivre (#CC7447) apporte de la chaleur et humanise le design

---

**Date de création**: 13 décembre 2025  
**Source**: Analyse du logo officiel Lampe Allumée (Luchnos)  
**Configuration**: `frontend/tailwind.config.js`
