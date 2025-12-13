const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const password = 'Admin@123';

async function fixAdminPassword() {
  try {
    // 1. Générer le bon hash
    console.log('🔐 Génération du hash pour: Admin@123');
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash généré:', hash);

    // 2. Connexion à la base
    const client = new Client({
      connectionString: 'postgresql://luchnos_db_user:O5F7S2L5kf7m2QOmJOT3b1fdDcCwvbIW@dpg-d4uc6e7gi27c738m804g-a.frankfurt-postgres.render.com/luchnos_db',
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('\n📡 Connecté à la base Render');

    // 3. Mettre à jour le mot de passe
    console.log('🔄 Mise à jour du mot de passe admin...');
    await client.query(
      `UPDATE utilisateurs SET password = $1 WHERE email = 'admin@luchnos.com'`,
      [hash]
    );

    // 4. Vérifier
    const result = await client.query(
      `SELECT id, nom, email, role FROM utilisateurs WHERE email = 'admin@luchnos.com'`
    );

    console.log('✅ Mot de passe mis à jour!');
    console.log('Admin:', result.rows[0]);

    await client.end();

    // 5. Tester la connexion
    console.log('\n🧪 Test de connexion...');
    const axios = require('axios');
    const loginResponse = await axios.post('https://luchnos.onrender.com/api/auth/login', {
      email: 'admin@luchnos.com',
      password: 'Admin@123'
    });

    console.log('✅ Connexion réussie!');
    console.log('Réponse complète:', JSON.stringify(loginResponse.data, null, 2));
    if (loginResponse.data.data && loginResponse.data.data.token) {
      console.log('\n✅ Token JWT reçu!');
      console.log('Role:', loginResponse.data.data.user.role);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Réponse API:', error.response.data);
    }
  }
}

fixAdminPassword();
