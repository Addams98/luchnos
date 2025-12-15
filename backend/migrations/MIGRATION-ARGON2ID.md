# 🔒 Migration Argon2id - Hashing de Mots de Passe Sécurisé

## Contexte
Actuellement, l'application utilise bcrypt pour hasher les mots de passe. Argon2id est recommandé par l'OWASP comme algorithme de hashing le plus sécurisé en 2024.

## Avantages d'Argon2id
- ✅ Résistant aux attaques GPU/ASIC (protection matérielle)
- ✅ Protection contre les attaques par canal auxiliaire
- ✅ Gagnant du Password Hashing Competition (2015)
- ✅ Recommandé par OWASP, NIST, RFC 9106
- ✅ Paramètres configurables (memory cost, time cost, parallelism)

## Stratégie de Migration Progressive

### Étape 1 : Installation (✅ FAIT)
```bash
npm install argon2
```

### Étape 2 : Fonction de Hashing Hybride
Ajouter dans `routes/auth.js` :

```javascript
const argon2 = require('argon2');

// Fonction pour hasher avec Argon2id
async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 4     // 4 threads
  });
}

// Fonction pour vérifier (supporte bcrypt ET argon2)
async function verifyPassword(password, hash) {
  // Détecter le type de hash
  if (hash.startsWith('$argon2')) {
    // Hash Argon2
    return await argon2.verify(hash, password);
  } else if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    // Hash bcrypt (legacy)
    const isValid = await bcrypt.compare(password, hash);
    
    // Si valide, re-hasher avec Argon2 (migration progressive)
    if (isValid) {
      // Mettre à jour le hash dans la DB
      // (À implémenter selon votre logique)
    }
    
    return isValid;
  }
  
  throw new Error('Format de hash non reconnu');
}
```

### Étape 3 : Modifier la Route de Login
Dans `POST /api/auth/login` :

```javascript
// Vérifier le mot de passe avec la fonction hybride
const isValidPassword = await verifyPassword(password, user.password);

// Si bcrypt détecté et valide, re-hasher avec Argon2
if (isValidPassword && user.password.startsWith('$2')) {
  const newHash = await hashPassword(password);
  await db.query(
    'UPDATE utilisateurs SET password = $1 WHERE id = $2',
    [newHash, user.id]
  );
  console.log(`✅ Mot de passe migré vers Argon2id pour user ${user.id}`);
}
```

### Étape 4 : Modifier la Route de Changement de Mot de Passe
Dans `PUT /api/auth/password` :

```javascript
// Hasher le nouveau mot de passe avec Argon2
const hashedPassword = await hashPassword(newPassword);

await db.query(
  'UPDATE utilisateurs SET password = $1 WHERE id = $2',
  [hashedPassword, req.user.id]
);
```

### Étape 5 : Modifier la Route d'Enregistrement
Dans `POST /api/auth/register` :

```javascript
// Hasher avec Argon2 (plus besoin de bcrypt)
const hashedPassword = await hashPassword(userPassword);

await db.query(
  'INSERT INTO utilisateurs (nom, email, password, role, actif) VALUES ($1, $2, $3, $4, $5)',
  [nom, email, hashedPassword, role || 'user', actif !== false]
);
```

## Avantages de la Migration Progressive
1. ✅ **Zéro downtime** : Les utilisateurs n'ont pas besoin de réinitialiser leur mot de passe
2. ✅ **Migration automatique** : À chaque connexion, bcrypt → argon2id
3. ✅ **Rétrocompatibilité** : Les anciens hash continuent de fonctionner
4. ✅ **Sécurité immédiate** : Les nouveaux comptes utilisent Argon2id

## Script de Migration Forcée (Optionnel)
Pour forcer la migration de tous les utilisateurs :

```javascript
// backend/scripts/migrate-passwords-to-argon2.js
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const argon2 = require('argon2');

async function migratePasswords() {
  const result = await db.query('SELECT id, email, password FROM utilisateurs');
  
  for (const user of result.rows) {
    if (user.password.startsWith('$2')) {
      console.log(`Migration de ${user.email}...`);
      
      // IMPOSSIBLE : On ne peut pas déchiffrer bcrypt
      // Les utilisateurs devront se reconnecter pour migration automatique
      
      console.warn(`⚠️ ${user.email} nécessite reconnexion pour migration`);
    }
  }
}
```

**NOTE** : Impossible de migrer tous les mots de passe en une fois car bcrypt est à sens unique. La migration se fait lors de la prochaine connexion de chaque utilisateur.

## Vérification Post-Migration
```sql
-- Compter les mots de passe par type
SELECT 
  CASE 
    WHEN password LIKE '$argon2%' THEN 'Argon2id'
    WHEN password LIKE '$2%' THEN 'bcrypt'
    ELSE 'Inconnu'
  END as hash_type,
  COUNT(*) as nombre
FROM utilisateurs
GROUP BY hash_type;
```

## Recommandations Finales
1. Implémenter la fonction `verifyPassword()` hybride ASAP
2. Laisser la migration progressive se faire naturellement
3. Surveiller les logs pour suivre la progression
4. Après 6 mois, envoyer un email aux utilisateurs bcrypt pour forcer reconnexion
5. Après 1 an, désactiver le support bcrypt (tous migrés)

## Références
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Argon2 RFC 9106](https://datatracker.ietf.org/doc/html/rfc9106)
- [npm argon2 package](https://www.npmjs.com/package/argon2)
