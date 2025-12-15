/**
 * 🔒 Script pour générer un JWT_SECRET cryptographiquement sécurisé
 * 
 * Usage :
 *   node generate-jwt-secret.js
 * 
 * Le secret généré doit être ajouté dans :
 *   - Localement : backend/.env (JWT_SECRET=...)
 *   - Production : Render Dashboard → Environment Variables
 */

const crypto = require('crypto');

// Générer 64 bytes (512 bits) de données aléatoires cryptographiques
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 JWT_SECRET GÉNÉRÉ\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(secret);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📋 INSTRUCTIONS :\n');
console.log('1. Développement local :');
console.log('   Ajoutez cette ligne dans backend/.env :');
console.log(`   JWT_SECRET=${secret}\n`);

console.log('2. Production (Render) :');
console.log('   a. Allez sur https://dashboard.render.com');
console.log('   b. Sélectionnez votre service backend "luchnos"');
console.log('   c. Cliquez sur "Environment" dans le menu');
console.log('   d. Ajoutez une nouvelle variable :');
console.log('      - Key: JWT_SECRET');
console.log(`      - Value: ${secret}`);
console.log('   e. Cliquez sur "Save Changes" (redéploiement auto)\n');

console.log('⚠️  SÉCURITÉ :');
console.log('   - NE PARTAGEZ JAMAIS ce secret');
console.log('   - NE COMMITTEZ PAS dans Git (.env est dans .gitignore)');
console.log('   - Changez-le régulièrement (tous les 6 mois)');
console.log('   - Si compromis, générez-en un nouveau immédiatement\n');

console.log('✅ Longueur : 128 caractères hexadécimaux (512 bits)');
console.log('✅ Entropie : Cryptographiquement sécurisé (crypto.randomBytes)');
console.log('✅ Conforme : OWASP recommandations\n');
