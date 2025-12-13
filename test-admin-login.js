const axios = require('axios');

const API_URL = 'https://luchnos.onrender.com/api';

async function testAdminLogin() {
  try {
    console.log('🔐 Test de connexion admin...\n');
    console.log('URL:', API_URL);
    console.log('Email: admin@luchnos.com');
    console.log('Password: Admin@123\n');

    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@luchnos.com',
      password: 'Admin@123'
    });

    console.log('✅ Connexion réussie!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);

  } catch (error) {
    console.error('❌ Erreur de connexion:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testAdminLogin();
